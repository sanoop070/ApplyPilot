from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ResumeCreate(BaseModel):
    resume_text: str = Field(
        min_length=50,
        description="The candidate's resume text.",
    )
    filename: str | None = Field(
        default=None,
        max_length=255,
    )


class ResumeUpdate(BaseModel):
    resume_text: str = Field(
        min_length=50,
        description="Updated candidate resume text.",
    )
    filename: str | None = Field(
        default=None,
        max_length=255,
    )


class ResumeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    filename: str | None
    resume_text: str
    created_at: datetime
    updated_at: datetime
