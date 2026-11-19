import json

from app.schemas.resume_match import ResumeMatchResponse
from app.services.groq_service import GroqService


class ResumeMatchService:
    def __init__(self) -> None:
        self.groq = GroqService()

    def match(
        self,
        resume_text: str,
        job_description: str,
    ) -> ResumeMatchResponse:
        prompt = f"""
Analyze how well the candidate's resume matches the target internship.

Return ONLY valid JSON with exactly these fields:

{{
  "fit_score": 0,
  "strong_matches": [],
  "missing_skills": [],
  "experience_gaps": [],
  "resume_improvements": [],
  "recommendation": ""
}}

Rules:
- fit_score must be a number from 0 to 100.
- strong_matches must list skills, technologies, experience, or qualifications
  present in the resume that align with the job.
- missing_skills must list important job requirements that are not clearly
  demonstrated in the resume.
- experience_gaps must identify meaningful experience or qualification gaps.
- resume_improvements must give specific, actionable improvements to better
  target this particular job.
- recommendation must be concise and practical.
- Do not invent experience that is not present in the resume.
- Do not include markdown.
- Do not include ```json or ```.

CANDIDATE RESUME:
{resume_text}

TARGET JOB DESCRIPTION:
{job_description}
"""

        raw_response = self.groq.generate(prompt)

        try:
            data = json.loads(raw_response)
        except json.JSONDecodeError as exc:
            raise ValueError(
                "Groq returned an invalid JSON response."
            ) from exc

        return ResumeMatchResponse.model_validate(data)


resume_match_service = ResumeMatchService()
