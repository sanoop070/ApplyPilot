import json
import sys
import time
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(BACKEND_DIR))

from app.services.recommendation_service import recommendation_service


DATASET_PATH = Path(__file__).with_name("dataset.json")
CACHE_PATH = Path(__file__).with_name("cached_evidence.json")

MAX_TPM_RETRIES = 4
TPM_RETRY_DELAY_SECONDS = 5


def load_json(path: Path):
    with path.open(
        "r",
        encoding="utf-8-sig",
    ) as file:
        return json.load(file)


def save_cache(data: list[dict]):
    with CACHE_PATH.open(
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            data,
            file,
            indent=2,
            ensure_ascii=False,
        )


def is_rate_limit_error(exc: Exception) -> bool:
    text = str(exc).lower()

    return (
        "rate limit" in text
        or "429" in text
        or "rate_limit_exceeded" in text
    )


def is_daily_limit_error(exc: Exception) -> bool:
    text = str(exc).lower()

    return (
        "tokens per day" in text
        or ("tpd" in text and "tpm" not in text)
    )


def main():
    dataset = load_json(DATASET_PATH)

    if CACHE_PATH.exists():
        cached = load_json(CACHE_PATH)
    else:
        cached = []
        save_cache(cached)

    cached_ids = {
        item["id"]
        for item in cached
    }

    print(
        f"Existing cached cases: {len(cached)}"
    )

    for item in dataset:
        case_id = item["id"]

        if case_id in cached_ids:
            print(
                f"Skipping case #{case_id} "
                "(already cached)...",
                flush=True,
            )
            continue

        print(
            f"Generating evidence for case #{case_id}...",
            flush=True,
        )

        tpm_attempts = 0

        while True:
            try:
                result = recommendation_service.recommend(
                    resume_text=item["resume"],
                    job_description=item["job_description"],
                )

                cached.append(
                    {
                        "id": case_id,
                        "case_type": item["case_type"],
                        "human_match": item["human_match"],
                        "human_score": item["human_score"],
                        "recommendation": result.model_dump(),
                    }
                )

                save_cache(cached)

                cached_ids.add(case_id)

                print(
                    f"  Cached case #{case_id}.",
                    flush=True,
                )

                break

            except Exception as exc:
                if not is_rate_limit_error(exc):
                    raise

                if is_daily_limit_error(exc):
                    print()
                    print(
                        "Groq daily token limit reached."
                    )
                    print(
                        "Stopping safely. "
                        "Already cached cases were saved."
                    )
                    print(
                        f"Cached cases: {len(cached)}"
                    )
                    return

                tpm_attempts += 1

                if tpm_attempts > MAX_TPM_RETRIES:
                    print()
                    print(
                        "Groq token-per-minute limit "
                        "could not be cleared."
                    )
                    print(
                        "Stopping safely. "
                        "Already cached cases were saved."
                    )
                    print(
                        f"Cached cases: {len(cached)}"
                    )
                    return

                print(
                    f"  Temporary rate limit. "
                    f"Waiting {TPM_RETRY_DELAY_SECONDS}s "
                    f"({tpm_attempts}/{MAX_TPM_RETRIES})...",
                    flush=True,
                )

                time.sleep(
                    TPM_RETRY_DELAY_SECONDS
                )

    print()
    print("=" * 60)
    print("Evidence cache generation complete")
    print("=" * 60)
    print(
        f"Cached cases: {len(cached)}"
    )
    print(
        f"Cache file:   {CACHE_PATH}"
    )


if __name__ == "__main__":
    main()
