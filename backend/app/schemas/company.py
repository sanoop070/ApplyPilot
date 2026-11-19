from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CompanyCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=200,
    )
    website: str | None = Field(
        default=None,
        max_length=500,
    )
    careers_url: str | None = Field(
        default=None,
        max_length=500,
    )
    description: str | None = None


class CompanyUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
    )
    website: str | None = Field(
        default=None,
        max_length=500,
    )
    careers_url: str | None = Field(
        default=None,
        max_length=500,
    )
    description: str | None = None


class CompanyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    website: str | None
    careers_url: str | None
    description: str | None
    created_at: datetime
    updated_at: datetime
