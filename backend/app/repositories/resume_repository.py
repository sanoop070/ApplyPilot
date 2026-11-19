from sqlalchemy.orm import Session

from app.models.resume import Resume


class ResumeRepository:
    @staticmethod
    def get_by_user_id(
        db: Session,
        user_id: int,
    ) -> Resume | None:
        return (
            db.query(Resume)
            .filter(Resume.user_id == user_id)
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        user_id: int,
        resume_text: str,
        filename: str | None = None,
    ) -> Resume:
        resume = Resume(
            user_id=user_id,
            resume_text=resume_text,
            filename=filename,
        )

        db.add(resume)
        db.commit()
        db.refresh(resume)

        return resume

    @staticmethod
    def update(
        db: Session,
        resume: Resume,
        resume_text: str,
        filename: str | None = None,
    ) -> Resume:
        resume.resume_text = resume_text
        resume.filename = filename

        db.commit()
        db.refresh(resume)

        return resume

    @staticmethod
    def delete(
        db: Session,
        resume: Resume,
    ) -> None:
        db.delete(resume)
        db.commit()


resume_repository = ResumeRepository()
