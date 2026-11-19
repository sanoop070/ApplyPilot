from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.follow_up import FollowUp


class FollowUpRepository:
    @staticmethod
    def create(
        db: Session,
        user_id: int,
        application_id: int,
        follow_up_date: date,
        note: str | None = None,
    ) -> FollowUp:
        follow_up = FollowUp(
            user_id=user_id,
            application_id=application_id,
            follow_up_date=follow_up_date,
            note=note,
        )

        db.add(follow_up)
        db.commit()
        db.refresh(follow_up)

        return follow_up

    @staticmethod
    def get_by_id(
        db: Session,
        follow_up_id: int,
    ) -> FollowUp | None:
        return db.get(FollowUp, follow_up_id)

    @staticmethod
    def get_all(
        db: Session,
        user_id: int,
    ) -> list[FollowUp]:
        statement = (
            select(FollowUp)
            .where(FollowUp.user_id == user_id)
            .order_by(
                FollowUp.follow_up_date.asc(),
                FollowUp.created_at.asc(),
            )
        )

        return list(db.scalars(statement).all())

    @staticmethod
    def update(
        db: Session,
        follow_up: FollowUp,
        data: dict,
    ) -> FollowUp:
        for field, value in data.items():
            setattr(follow_up, field, value)

        db.commit()
        db.refresh(follow_up)

        return follow_up

    @staticmethod
    def delete(
        db: Session,
        follow_up: FollowUp,
    ) -> None:
        db.delete(follow_up)
        db.commit()


follow_up_repository = FollowUpRepository()
