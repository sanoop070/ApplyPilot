from pydantic import BaseModel, Field


class JobAnalysisRequest(BaseModel):
    job_description: str = Field(
        min_length=20,  
        description="The full internship job description to analyze.",
    )


class JobAnalysisResponse(BaseModel):
    summary: str
    fit_score: float = Field(ge=0, le=100)
    required_skills: list[str]
    nice_to_have: list[str]
    skill_gaps: list[str]
    recommendation: str
