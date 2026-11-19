from app.schemas.cover_letter import CoverLetterResponse
from app.services.groq_service import GroqService


class CoverLetterService:
    def __init__(self) -> None:
        self.groq = GroqService()

    def generate(
        self,
        candidate_name: str,
        resume_text: str,
        company_name: str,
        role: str,
        job_description: str,
    ) -> CoverLetterResponse:
        prompt = f"""
Write a tailored internship cover letter for the candidate below.

Return ONLY valid JSON with exactly these fields:

{{
  "subject": "",
  "cover_letter": ""
}}

Rules:
- Write a professional, confident, natural cover letter.
- Keep it between 250 and 400 words.
- Tailor it specifically to the company and role.
- Use evidence from the resume.
- Do not invent experience, achievements, technologies, or qualifications.
- Do not repeat the entire resume.
- Avoid generic phrases and exaggerated claims.
- Make the letter sound like a strong student/early-career candidate.
- Do not include markdown.
- Do not include ```json or ```.

CANDIDATE NAME:
{candidate_name}

COMPANY:
{company_name}

ROLE:
{role}

CANDIDATE RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}
"""

        raw_response = self.groq.generate(prompt)

        import json

        try:
            data = json.loads(raw_response)
        except json.JSONDecodeError as exc:
            raise ValueError(
                "Groq returned an invalid JSON response."
            ) from exc

        return CoverLetterResponse.model_validate(data)


cover_letter_service = CoverLetterService()
