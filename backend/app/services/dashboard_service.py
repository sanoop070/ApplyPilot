from datetime import date, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.application import Application, ApplicationStatus
from app.models.company import Company
from app.models.follow_up import FollowUp
from app.schemas.dashboard import (
    ApplicationStats,
    DashboardResponse,
    UpcomingDeadline,
    UpcomingFollowUp,
)


class DashboardService:
    @staticmethod
    def get_dashboard(
        db: Session,
        user_id: int,
    ) -> DashboardResponse:
        rows = db.execute(
            select(
                Application.status,
                func.count(Application.id),
            )
            .where(Application.user_id == user_id)
            .group_by(Application.status)
        ).all()

        counts = {
            status: count
            for status, count in rows
        }

        stats = ApplicationStats(
            total=sum(counts.values()),
            saved=counts.get(ApplicationStatus.SAVED, 0),
            applied=counts.get(ApplicationStatus.APPLIED, 0),
            online_assessment=counts.get(ApplicationStatus.OA, 0),
            interview=counts.get(ApplicationStatus.INTERVIEW, 0),
            offer=counts.get(ApplicationStatus.OFFER, 0),
            rejected=counts.get(ApplicationStatus.REJECTED, 0),
            withdrawn=counts.get(ApplicationStatus.WITHDRAWN, 0),
        )

        today = date.today()
        deadline_cutoff = today + timedelta(days=30)

        deadline_statement = (
            select(
                Application.id,
                Company.name,
                Application.role,
                Application.deadline,
            )
            .join(
                Company,
                Company.id == Application.company_id,
            )
            .where(
                Application.user_id == user_id,
                Application.deadline.is_not(None),
                Application.deadline >= today,
                Application.deadline <= deadline_cutoff,
            )
            .order_by(Application.deadline.asc())
            .limit(10)
        )

        deadline_rows = db.execute(
            deadline_statement
        ).all()

        upcoming_deadlines = [
            UpcomingDeadline(
                application_id=application_id,
                company_name=company_name,
                role=role,
                deadline=deadline,
            )
            for (
                application_id,
                company_name,
                role,
                deadline,
            ) in deadline_rows
        ]

        follow_up_statement = (
            select(
                FollowUp.id,
                FollowUp.application_id,
                Company.name,
                Application.role,
                FollowUp.follow_up_date,
                FollowUp.note,
                FollowUp.completed,
            )
            .join(
                Application,
                Application.id == FollowUp.application_id,
            )
            .join(
                Company,
                Company.id == Application.company_id,
            )
            .where(
                FollowUp.user_id == user_id,
                FollowUp.follow_up_date >= today,
                FollowUp.completed.is_(False),
            )
            .order_by(FollowUp.follow_up_date.asc())
            .limit(10)
        )

        follow_up_rows = db.execute(
            follow_up_statement
        ).all()

        upcoming_follow_ups = [
            UpcomingFollowUp(
                follow_up_id=follow_up_id,
                application_id=application_id,
                company_name=company_name,
                role=role,
                follow_up_date=follow_up_date,
                note=note,
                completed=completed,
            )
            for (
                follow_up_id,
                application_id,
                company_name,
                role,
                follow_up_date,
                note,
                completed,
            ) in follow_up_rows
        ]

        decided_applications = (
            stats.offer
            + stats.rejected
        )

        success_rate = (
            (stats.offer / decided_applications) * 100
            if decided_applications
            else 0.0
        )

        return DashboardResponse(
            stats=stats,
            upcoming_deadlines=upcoming_deadlines,
            upcoming_follow_ups=upcoming_follow_ups,
            success_rate=round(success_rate, 2),
        )


dashboard_service = DashboardService()
