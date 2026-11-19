import json

from app.core.config import get_settings
from app.schemas.ai import JobAnalysisResponse
from app.services.groq_service import GroqService


class JobAnalysisService:
    def __init__(self) -> None:
        self.groq = GroqService()

    def analyze(self, job_description: str) -> JobAnalysisResponse:
        prompt = f"""
Analyze the following internship job description for ApplyPilot.

Return ONLY valid JSON with exactly these fields:

{{
  "summary": "A concise summary of the role.",
  "fit_score": 0,
  "required_skills": [],
  "nice_to_have": [],
  "skill_gaps": [],
  "recommendation": "A concise recommendation."
}}

Rules:
- fit_score must be a number from 0 to 100.
- required_skills must contain the important required technical and professional skills.
- nice_to_have must contain preferred or bonus skills.
- skill_gaps should identify skills that may be missing or need improvement for a typical student candidate.
- recommendation should be practical and concise.
- Do not include markdown.
- Do not include ```json or ```.

Job description:
{job_description}
"""

        raw_response = self.groq.generate(prompt)

        try:
            data = json.loads(raw_response)
        except json.JSONDecodeError as exc:
            raise ValueError(
                "Groq returned an invalid JSON response."
            ) from exc

        return JobAnalysisResponse.model_validate(data)


job_analysis_service = JobAnalysisService()
