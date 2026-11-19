from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class FollowUpCreate(BaseModel):
    application_id: int
    follow_up_date: date
    note: str | None = Field(
        default=None,
        max_length=2000,
    )


class FollowUpUpdate(BaseModel):
    follow_up_date: date | None = None
    note: str | None = Field(
        default=None,
        max_length=2000,
    )
    completed: bool | None = None


class FollowUpResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    application_id: int
    follow_up_date: date
    note: str | None
    completed: bool
    created_at: datetime
    updated_at: datetime
