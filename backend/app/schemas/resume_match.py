from pydantic import BaseModel, Field


class ResumeMatchRequest(BaseModel):
    resume_text: str = Field(
        min_length=50,
        description="The candidate's resume text.",
    )

    job_description: str = Field(
        min_length=20,
        description="The target internship job description.",
    )


class ResumeMatchResponse(BaseModel):
    fit_score: float = Field(
        ge=0,
        le=100,
    )

    strong_matches: list[str]

    missing_skills: list[str]

    experience_gaps: list[str]

    resume_improvements: list[str]

    recommendation: str
