from datetime import date

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.application import Application
from app.schemas.application import (
    ApplicationCreate,
    ApplicationFilter,
    ApplicationUpdate,
)


class ApplicationRepository:
    @staticmethod
    def create(
        db: Session,
        application_data: ApplicationCreate,
        user_id: int,
    ) -> Application:
        application = Application(
            **application_data.model_dump(),
            user_id=user_id,
        )

        db.add(application)
        db.commit()
        db.refresh(application)

        return application

    @staticmethod
    def get_by_id(
        db: Session,
        application_id: int,
    ) -> Application | None:
        return db.get(Application, application_id)

    @staticmethod
    def get_all(
        db: Session,
        user_id: int,
        filters: ApplicationFilter | None = None,
    ) -> list[Application]:
        statement = select(Application).where(
            Application.user_id == user_id
        )

        if filters is not None:
            if filters.status is not None:
                statement = statement.where(
                    Application.status == filters.status
                )

            if filters.search:
                search_term = f"%{filters.search.strip()}%"

                statement = statement.where(
                    or_(
                        Application.role.ilike(search_term),
                        Application.location.ilike(search_term),
                        Application.job_description.ilike(search_term),
                        Application.notes.ilike(search_term),
                    )
                )

            if filters.deadline_before is not None:
                statement = statement.where(
                    Application.deadline.is_not(None),
                    Application.deadline <= filters.deadline_before,
                )

            if filters.deadline_after is not None:
                statement = statement.where(
                    Application.deadline.is_not(None),
                    Application.deadline >= filters.deadline_after,
                )

        statement = statement.order_by(
            Application.created_at.desc()
        )

        return list(db.scalars(statement).all())

    @staticmethod
    def update(
        db: Session,
        application: Application,
        application_data: ApplicationUpdate,
    ) -> Application:
        update_data = application_data.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(application, field, value)

        db.commit()
        db.refresh(application)

        return application

    @staticmethod
    def delete(
        db: Session,
        application: Application,
    ) -> None:
        db.delete(application)
        db.commit()


application_repository = ApplicationRepository()
