from pydantic import BaseModel, Field


class ApplicationAnalysis(BaseModel):
    summary: str
    fit_score: float = Field(
        ge=0,
        le=100,
    )
    required_skills: list[str]
    nice_to_have: list[str]
    skill_gaps: list[str]
    recommendation: str
