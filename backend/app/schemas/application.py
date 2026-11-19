from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.application import ApplicationStatus


class ApplicationBase(BaseModel):
    company_id: int
    role: str = Field(min_length=1, max_length=300)
    job_url: str | None = Field(default=None, max_length=1000)
    location: str | None = Field(default=None, max_length=300)
    employment_type: str | None = Field(default=None, max_length=100)
    salary: str | None = Field(default=None, max_length=200)
    status: ApplicationStatus = ApplicationStatus.SAVED
    applied_date: date | None = None
    deadline: date | None = None
    recruiter_name: str | None = Field(default=None, max_length=200)
    recruiter_email: str | None = Field(default=None, max_length=320)
    job_description: str | None = None
    notes: str | None = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    company_id: int | None = None
    role: str | None = Field(default=None, min_length=1, max_length=300)
    job_url: str | None = Field(default=None, max_length=1000)
    location: str | None = Field(default=None, max_length=300)
    employment_type: str | None = Field(default=None, max_length=100)
    salary: str | None = Field(default=None, max_length=200)
    status: ApplicationStatus | None = None
    applied_date: date | None = None
    deadline: date | None = None
    recruiter_name: str | None = Field(default=None, max_length=200)
    recruiter_email: str | None = Field(default=None, max_length=320)
    job_description: str | None = None
    notes: str | None = None


class ApplicationFilter(BaseModel):
    status: ApplicationStatus | None = None
    search: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )
    deadline_before: date | None = None
    deadline_after: date | None = None


class ApplicationResponse(ApplicationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    ai_summary: str | None = None
    ai_fit_score: float | None = None
    ai_analysis: str | None = None
    created_at: datetime
    updated_at: datetime
