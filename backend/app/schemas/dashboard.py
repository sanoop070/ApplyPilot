from datetime import date

from pydantic import BaseModel


class ApplicationStats(BaseModel):
    total: int
    saved: int
    applied: int
    online_assessment: int
    interview: int
    offer: int
    rejected: int
    withdrawn: int


class UpcomingDeadline(BaseModel):
    application_id: int
    company_name: str
    role: str
    deadline: date


class UpcomingFollowUp(BaseModel):
    follow_up_id: int
    application_id: int
    company_name: str
    role: str
    follow_up_date: date
    note: str | None
    completed: bool


class DashboardResponse(BaseModel):
    stats: ApplicationStats
    upcoming_deadlines: list[UpcomingDeadline]
    upcoming_follow_ups: list[UpcomingFollowUp]
    success_rate: float
