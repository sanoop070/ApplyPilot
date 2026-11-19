from pydantic import BaseModel, Field

from app.schemas.matching import SkillEvidence


class RecommendationRequest(BaseModel):
    resume_text: str = Field(
        min_length=20,
        description="Candidate resume text.",
    )
    job_description: str = Field(
        min_length=20,
        description="Internship job description.",
    )


class RecommendationResponse(BaseModel):
    recommendation: str
    match_score: float = Field(ge=0, le=100)
    confidence: float = Field(ge=0, le=100)

    matched_required_skills: list[SkillEvidence]
    missing_required_skills: list[str]

    matched_nice_to_have: list[SkillEvidence]
    missing_nice_to_have: list[str]

    relevant_experience: list[str]
    relevant_projects: list[str]
    education_match: list[str]
    uncertainties: list[str]
