from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.repositories.resume_repository import resume_repository
from app.schemas.resume import (
    ResumeCreate,
    ResumeResponse,
    ResumeUpdate,
)


router = APIRouter(
    prefix="/api/resume",
    tags=["Resume"],
)


@router.post(
    "",
    response_model=ResumeResponse,
    status_code=201,
)
def create_resume(
    resume_data: ResumeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ResumeResponse:
    existing_resume = resume_repository.get_by_user_id(
        db,
        current_user.id,
    )

    if existing_resume is not None:
        raise HTTPException(
            status_code=409,
            detail="A resume already exists. Use PUT to update it.",
        )

    return resume_repository.create(
        db=db,
        user_id=current_user.id,
        resume_text=resume_data.resume_text,
        filename=resume_data.filename,
    )


@router.get(
    "",
    response_model=ResumeResponse,
)
def get_resume(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ResumeResponse:
    resume = resume_repository.get_by_user_id(
        db,
        current_user.id,
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found.",
        )

    return resume


@router.put(
    "",
    response_model=ResumeResponse,
)
def update_resume(
    resume_data: ResumeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ResumeResponse:
    resume = resume_repository.get_by_user_id(
        db,
        current_user.id,
    )

    if resume is None:
        return resume_repository.create(
            db=db,
            user_id=current_user.id,
            resume_text=resume_data.resume_text,
            filename=resume_data.filename,
        )

    return resume_repository.update(
        db=db,
        resume=resume,
        resume_text=resume_data.resume_text,
        filename=resume_data.filename,
    )


@router.delete(
    "",
    status_code=204,
)
def delete_resume(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    resume = resume_repository.get_by_user_id(
        db,
        current_user.id,
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found.",
        )

    resume_repository.delete(
        db,
        resume,
    )
