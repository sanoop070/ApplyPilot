import json
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(BACKEND_DIR))

from app.schemas.matching import MatchingEvidence
from app.services.matching_score_service import matching_score_service


DATASET_PATH = Path(__file__).with_name("dataset.json")
CACHE_PATH = Path(__file__).with_name("cached_evidence.json")

MATCH_THRESHOLD = 65.0


def load_json(path: Path):
    with path.open(
        "r",
        encoding="utf-8-sig",
    ) as file:
        return json.load(file)


def score_to_match(score: float) -> bool:
    return score >= MATCH_THRESHOLD


def calculate_score(recommendation: dict) -> float:
    evidence = MatchingEvidence.model_validate(
        {
            "matched_required_skills": recommendation.get(
                "matched_required_skills",
                [],
            ),
            "missing_required_skills": recommendation.get(
                "missing_required_skills",
                [],
            ),
            "matched_nice_to_have": recommendation.get(
                "matched_nice_to_have",
                [],
            ),
            "missing_nice_to_have": recommendation.get(
                "missing_nice_to_have",
                [],
            ),
            "relevant_experience": recommendation.get(
                "relevant_experience",
                [],
            ),
            "relevant_projects": recommendation.get(
                "relevant_projects",
                [],
            ),
            "education_match": recommendation.get(
                "education_match",
                [],
            ),
            "experience_level": recommendation.get(
                "experience_level",
            ),
            "uncertainties": recommendation.get(
                "uncertainties",
                [],
            ),
        }
    )

    total_required_skills = (
        len(evidence.matched_required_skills)
        + len(evidence.missing_required_skills)
    )

    total_nice_to_have_skills = (
        len(evidence.matched_nice_to_have)
        + len(evidence.missing_nice_to_have)
    )

    return matching_score_service.calculate(
        evidence,
        total_required_skills,
        total_nice_to_have_skills,
    )


def main() -> None:
    dataset = load_json(DATASET_PATH)

    if not CACHE_PATH.exists():
        print()
        print(
            "ERROR: cached_evidence.json does not exist."
        )
        print()
        print(
            "The Groq evidence cache has not been generated yet."
        )
        print(
            "Run generate_evidence_cache.py after the "
            "Groq token limit resets."
        )
        return

    cache = load_json(CACHE_PATH)

    cache_by_id = {
        item["id"]: item
        for item in cache
    }

    evaluated = []
    missing_cache = []

    for item in dataset:
        case_id = item["id"]

        cached_item = cache_by_id.get(case_id)

        if cached_item is None:
            missing_cache.append(case_id)
            continue

        recommendation = cached_item["recommendation"]

        predicted_score = calculate_score(
            recommendation
        )

        predicted_match = score_to_match(
            predicted_score
        )

        human_match = bool(
            item["human_match"]
        )

        evaluated.append(
            {
                "id": case_id,
                "case_type": item["case_type"],
                "human_match": human_match,
                "predicted_match": predicted_match,
                "human_score": item["human_score"],
                "predicted_score": predicted_score,
            }
        )

    print()
    print("=" * 70)
    print("ApplyPilot Cached Matching Evaluation")
    print("=" * 70)

    print(
        f"Dataset cases:      {len(dataset)}"
    )

    print(
        f"Cached cases:       {len(cache)}"
    )

    print(
        f"Evaluated:          {len(evaluated)}"
    )

    print(
        f"Missing cache:      {len(missing_cache)}"
    )

    print()

    if not evaluated:
        print(
            "No cached cases are available for evaluation."
        )
        return

    correct = sum(
        item["human_match"]
        == item["predicted_match"]
        for item in evaluated
    )

    accuracy = (
        correct / len(evaluated)
    ) * 100

    absolute_errors = [
        abs(
            item["predicted_score"]
            - item["human_score"]
        )
        for item in evaluated
    ]

    mean_absolute_error = (
        sum(absolute_errors)
        / len(absolute_errors)
    )

    false_positives = [
        item
        for item in evaluated
        if (
            item["human_match"] is False
            and item["predicted_match"] is True
        )
    ]

    false_negatives = [
        item
        for item in evaluated
        if (
            item["human_match"] is True
            and item["predicted_match"] is False
        )
    ]

    print(
        f"Correct:            {correct}"
    )

    print(
        f"Accuracy:           {accuracy:.2f}%"
    )

    print(
        f"Mean absolute error:{mean_absolute_error:8.2f}"
    )

    print(
        f"False positives:    {len(false_positives)}"
    )

    print(
        f"False negatives:    {len(false_negatives)}"
    )

    print()
    print("CASE RESULTS")
    print("-" * 70)

    for item in evaluated:
        status = (
            "CORRECT"
            if item["human_match"]
            == item["predicted_match"]
            else "WRONG"
        )

        print(
            f"#{item['id']} "
            f"[{item['case_type']}] "
            f"{status} | "
            f"human={item['human_match']} | "
            f"predicted={item['predicted_match']} | "
            f"human_score={item['human_score']} | "
            f"predicted_score={item['predicted_score']:.2f}"
        )

    if false_positives:
        print()
        print("FALSE POSITIVES")
        print("-" * 70)

        for item in false_positives:
            print(
                f"#{item['id']} "
                f"[{item['case_type']}] "
                f"score={item['predicted_score']:.2f}"
            )

    if false_negatives:
        print()
        print("FALSE NEGATIVES")
        print("-" * 70)

        for item in false_negatives:
            print(
                f"#{item['id']} "
                f"[{item['case_type']}] "
                f"score={item['predicted_score']:.2f}"
            )

    if missing_cache:
        print()
        print(
            f"Missing cached case IDs: "
            f"{missing_cache}"
        )


if __name__ == "__main__":
    main()
