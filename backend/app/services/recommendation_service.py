import json

from app.schemas.matching import (
    ExperienceLevelEvidence,
    MatchingEvidence,
)
from app.schemas.recommendation import RecommendationResponse
from app.services.groq_service import GroqService
from app.services.matching_score_service import matching_score_service


class RecommendationService:
    def __init__(self):
        self.groq = GroqService()

    @staticmethod
    def _stringify(value) -> str:
        if isinstance(value, str):
            return value.strip()

        if isinstance(value, dict):
            for key in (
                "description",
                "evidence",
                "skill",
                "text",
                "reason",
                "item",
            ):
                if value.get(key):
                    return str(value[key]).strip()

        return str(value).strip()

    @classmethod
    def _normalize_skill_evidence(cls, items) -> list[dict]:
        normalized = []

        for item in items or []:
            if isinstance(item, str):
                normalized.append(
                    {
                        "skill": item,
                        "evidence": "",
                        "confidence": 50.0,
                        "match_type": "direct",
                    }
                )
                continue

            if not isinstance(item, dict):
                continue

            skill = cls._stringify(
                item.get(
                    "skill",
                    item.get("name", ""),
                )
            )

            evidence = cls._stringify(
                item.get(
                    "evidence",
                    item.get("description", ""),
                )
            )

            confidence = item.get(
                "confidence",
                50.0,
            )

            try:
                confidence = float(confidence)
            except (TypeError, ValueError):
                confidence = 50.0

            match_type = str(
                item.get(
                    "match_type",
                    "direct",
                )
            ).strip().lower()

            if match_type not in {
                "direct",
                "transferable",
                "partial",
            }:
                match_type = "partial"

            if skill:
                normalized.append(
                    {
                        "skill": skill,
                        "evidence": evidence,
                        "confidence": max(
                            0.0,
                            min(100.0, confidence),
                        ),
                        "match_type": match_type,
                    }
                )

        return normalized

    @classmethod
    def _normalize_strings(cls, items) -> list[str]:
        normalized = []

        for item in items or []:
            value = cls._stringify(item)

            if value:
                normalized.append(value)

        return normalized

    @classmethod
    def _normalize_experience_level(
        cls,
        value,
    ) -> dict | None:
        if not isinstance(value, dict):
            return None

        candidate_level = cls._stringify(
            value.get("candidate_level", "unknown")
        )

        role_level = cls._stringify(
            value.get("role_level", "unknown")
        )

        evidence = cls._stringify(
            value.get("evidence", "")
        )

        compatible = value.get(
            "compatible",
            True,
        )

        if isinstance(compatible, str):
            compatible = compatible.strip().lower() in {
                "true",
                "yes",
                "compatible",
            }

        confidence = value.get(
            "confidence",
            50.0,
        )

        try:
            confidence = float(confidence)
        except (TypeError, ValueError):
            confidence = 50.0

        return {
            "candidate_level": candidate_level or "unknown",
            "role_level": role_level or "unknown",
            "compatible": bool(compatible),
            "evidence": evidence,
            "confidence": max(
                0.0,
                min(100.0, confidence),
            ),
        }

    @classmethod
    def _normalize_evidence(
        cls,
        data: dict,
    ) -> dict:
        return {
            "matched_required_skills": (
                cls._normalize_skill_evidence(
                    data.get(
                        "matched_required_skills",
                        [],
                    )
                )
            ),
            "missing_required_skills": (
                cls._normalize_strings(
                    data.get(
                        "missing_required_skills",
                        [],
                    )
                )
            ),
            "matched_nice_to_have": (
                cls._normalize_skill_evidence(
                    data.get(
                        "matched_nice_to_have",
                        [],
                    )
                )
            ),
            "missing_nice_to_have": (
                cls._normalize_strings(
                    data.get(
                        "missing_nice_to_have",
                        [],
                    )
                )
            ),
            "relevant_experience": (
                cls._normalize_strings(
                    data.get(
                        "relevant_experience",
                        [],
                    )
                )
            ),
            "relevant_projects": (
                cls._normalize_strings(
                    data.get(
                        "relevant_projects",
                        [],
                    )
                )
            ),
            "education_match": (
                cls._normalize_strings(
                    data.get(
                        "education_match",
                        [],
                    )
                )
            ),
            "experience_level": (
                cls._normalize_experience_level(
                    data.get(
                        "experience_level"
                    )
                )
            ),
            "uncertainties": (
                cls._normalize_strings(
                    data.get(
                        "uncertainties",
                        [],
                    )
                )
            ),
        }

    def recommend(
        self,
        resume_text: str,
        job_description: str,
    ) -> RecommendationResponse:
        prompt = f"""
You are the evidence extraction engine for ApplyPilot.

Compare the candidate resume against the internship job description.

Your job is ONLY to identify evidence.
The Python backend calculates the final match score.

STRICT RULES:
- Do NOT calculate a match score.
- Do NOT invent skills, experience, projects, education, or achievements.
- Only use evidence explicitly supported by the resume.
- Distinguish required skills from nice-to-have skills.
- Be conservative when evidence is ambiguous.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not include code fences.

SKILL MATCH TYPES:

"direct":
The resume explicitly demonstrates the requested skill.

"transferable":
The resume demonstrates closely related experience that can reasonably
transfer to the requested requirement.

"partial":
The resume provides some relevant evidence, but it is incomplete.

Do NOT call unrelated technologies transferable.

EXPERIENCE LEVEL:

Determine whether the candidate's experience level is compatible with
the role.

For an internship:
- Current students and recent graduates are normally compatible.
- Candidates with substantially more professional experience may be
  overqualified.
- Do not penalize a candidate simply for having strong skills.
- Only mark incompatible when the resume provides clear evidence of a
  meaningful experience-level mismatch.

Return exactly:

{{
  "matched_required_skills": [
    {{
      "skill": "skill from job description",
      "evidence": "specific resume evidence",
      "confidence": 95,
      "match_type": "direct"
    }}
  ],
  "missing_required_skills": [
    "skill from job description"
  ],
  "matched_nice_to_have": [
    {{
      "skill": "skill from job description",
      "evidence": "specific resume evidence",
      "confidence": 85,
      "match_type": "transferable"
    }}
  ],
  "missing_nice_to_have": [
    "skill from job description"
  ],
  "relevant_experience": [
    "specific evidence"
  ],
  "relevant_projects": [
    "specific evidence"
  ],
  "education_match": [
    "specific evidence"
  ],
  "experience_level": {{
    "candidate_level": "intern/student/junior/mid/senior/unknown",
    "role_level": "intern/junior/mid/senior/unknown",
    "compatible": true,
    "evidence": "specific evidence supporting the assessment",
    "confidence": 90
  }},
  "uncertainties": [
    "specific uncertainty"
  ]
}}

CONFIDENCE:

90-100 = explicit and strong evidence
70-89 = clear but indirect
50-69 = plausible but incomplete
below 50 = do not count as confirmed

IMPORTANT:
- A skill not supported by the resume belongs in missing_*.
- Never put the same skill in both matched and missing.
- A technology appearing only in a skills list is weak evidence.
- Concrete projects and work experience are stronger evidence.
- Do not infer experience that is not stated.
- Explicitly identify meaningful experience-level mismatches.
- Do not treat optional skills as required skills.

CANDIDATE RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}
"""

        raw_response = self.groq.generate(prompt)

        try:
            data = json.loads(raw_response)
        except json.JSONDecodeError as exc:
            preview = raw_response[:1000].replace(
                "\n",
                "\\n",
            )

            raise ValueError(
                "Groq returned invalid JSON. "
                f"Response preview: {preview}"
            ) from exc

        normalized = self._normalize_evidence(data)

        evidence = MatchingEvidence.model_validate(
            normalized
        )

        total_required_skills = (
            len(evidence.matched_required_skills)
            + len(evidence.missing_required_skills)
        )

        total_nice_to_have_skills = (
            len(evidence.matched_nice_to_have)
            + len(evidence.missing_nice_to_have)
        )

        match_score = matching_score_service.calculate(
            evidence,
            total_required_skills,
            total_nice_to_have_skills,
        )

        confidence_values = [
            item.confidence
            for item in evidence.matched_required_skills
        ]

        confidence_values.extend(
            item.confidence
            for item in evidence.matched_nice_to_have
        )

        if evidence.experience_level:
            confidence_values.append(
                evidence.experience_level.confidence
            )

        confidence = (
            sum(confidence_values)
            / len(confidence_values)
            if confidence_values
            else 50.0
        )

        if match_score >= 80:
            recommendation = (
                "Strong match. The candidate demonstrates substantial "
                "alignment with the role requirements."
            )
        elif match_score >= 65:
            recommendation = (
                "Good potential match. The candidate meets several "
                "important requirements but has some areas to strengthen."
            )
        elif match_score >= 50:
            recommendation = (
                "Moderate match. Several relevant requirements are present, "
                "but meaningful gaps should be addressed."
            )
        else:
            recommendation = (
                "Weak match. The candidate currently has significant "
                "gaps against the role requirements."
            )

        return RecommendationResponse(
            recommendation=recommendation,
            match_score=match_score,
            confidence=round(
                confidence,
                2,
            ),
            matched_required_skills=(
                evidence.matched_required_skills
            ),
            missing_required_skills=(
                evidence.missing_required_skills
            ),
            matched_nice_to_have=(
                evidence.matched_nice_to_have
            ),
            missing_nice_to_have=(
                evidence.missing_nice_to_have
            ),
            relevant_experience=(
                evidence.relevant_experience
            ),
            relevant_projects=(
                evidence.relevant_projects
            ),
            education_match=(
                evidence.education_match
            ),
            experience_level=(
                evidence.experience_level
            ),
            uncertainties=(
                evidence.uncertainties
            ),
        )


recommendation_service = RecommendationService()
