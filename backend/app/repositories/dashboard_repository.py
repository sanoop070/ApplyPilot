from datetime import date

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.application import Application, ApplicationStatus
from app.models.company import Company


class DashboardRepository:
    @staticmethod
    def get_total_applications(
        db: Session,
        user_id: int,
    ) -> int:
        statement = select(
            func.count(Application.id)
        ).where(
            Application.user_id == user_id
        )

        return db.scalar(statement) or 0

    @staticmethod
    def get_status_counts(
        db: Session,
        user_id: int,
    ) -> dict[ApplicationStatus, int]:
        statement = (
            select(
                Application.status,
                func.count(Application.id),
            )
            .where(
                Application.user_id == user_id
            )
            .group_by(Application.status)
        )

        rows = db.execute(statement).all()

        return {
            status: count
            for status, count in rows
        }

    @staticmethod
    def get_upcoming_deadlines(
        db: Session,
        user_id: int,
    ) -> int:
        today = date.today()

        statement = select(
            func.count(Application.id)
        ).where(
            Application.user_id == user_id,
            Application.deadline.is_not(None),
            Application.deadline >= today,
        )

        return db.scalar(statement) or 0

    @staticmethod
    def get_upcoming_applications(
        db: Session,
        user_id: int,
        limit: int = 5,
    ) -> list[tuple[Application, str]]:
        today = date.today()

        statement = (
            select(
                Application,
                Company.name,
            )
            .join(
                Company,
                Application.company_id == Company.id,
            )
            .where(
                Application.user_id == user_id,
                Application.deadline.is_not(None),
                Application.deadline >= today,
            )
            .order_by(Application.deadline.asc())
            .limit(limit)
        )

        return list(db.execute(statement).all())


dashboard_repository = DashboardRepository()
