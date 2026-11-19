from pydantic import BaseModel, Field


class CoverLetterRequest(BaseModel):
    candidate_name: str = Field(
        min_length=1,
        max_length=200,
    )

    resume_text: str = Field(
        min_length=50,
    )

    company_name: str = Field(
        min_length=1,
        max_length=200,
    )

    role: str = Field(
        min_length=1,
        max_length=300,
    )

    job_description: str = Field(
        min_length=20,
    )


class CoverLetterResponse(BaseModel):
    subject: str
    cover_letter: str
