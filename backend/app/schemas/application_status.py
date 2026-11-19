from pydantic import BaseModel

from app.models.application import ApplicationStatus


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus
