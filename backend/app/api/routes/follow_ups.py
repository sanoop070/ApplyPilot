from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models.application import Application
from app.models.follow_up import FollowUp
from app.models.user import User
from app.repositories.follow_up_repository import follow_up_repository
from app.schemas.follow_up import (
    FollowUpCreate,
    FollowUpResponse,
    FollowUpUpdate,
)


router = APIRouter(
    prefix="/api/follow-ups",
    tags=["Follow-ups"],
)


@router.post(
    "",
    response_model=FollowUpResponse,
    status_code=201,
)
def create_follow_up(
    follow_up_data: FollowUpCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FollowUpResponse:
    application = db.get(
        Application,
        follow_up_data.application_id,
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )

    if application.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this application.",
        )

    return follow_up_repository.create(
        db=db,
        user_id=current_user.id,
        application_id=follow_up_data.application_id,
        follow_up_date=follow_up_data.follow_up_date,
        note=follow_up_data.note,
    )


@router.get(
    "",
    response_model=list[FollowUpResponse],
)
def get_follow_ups(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[FollowUpResponse]:
    return follow_up_repository.get_all(
        db,
        current_user.id,
    )


@router.get(
    "/{follow_up_id}",
    response_model=FollowUpResponse,
)
def get_follow_up(
    follow_up_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FollowUpResponse:
    follow_up = follow_up_repository.get_by_id(
        db,
        follow_up_id,
    )

    if follow_up is None:
        raise HTTPException(
            status_code=404,
            detail="Follow-up not found.",
        )

    if follow_up.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this follow-up.",
        )

    return follow_up


@router.patch(
    "/{follow_up_id}",
    response_model=FollowUpResponse,
)
def update_follow_up(
    follow_up_id: int,
    follow_up_data: FollowUpUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FollowUpResponse:
    follow_up = follow_up_repository.get_by_id(
        db,
        follow_up_id,
    )

    if follow_up is None:
        raise HTTPException(
            status_code=404,
            detail="Follow-up not found.",
        )

    if follow_up.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this follow-up.",
        )

    update_data = follow_up_data.model_dump(
        exclude_unset=True
    )

    return follow_up_repository.update(
        db,
        follow_up,
        update_data,
    )


@router.delete(
    "/{follow_up_id}",
    status_code=204,
)
def delete_follow_up(
    follow_up_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    follow_up = follow_up_repository.get_by_id(
        db,
        follow_up_id,
    )

    if follow_up is None:
        raise HTTPException(
            status_code=404,
            detail="Follow-up not found.",
        )

    if follow_up.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this follow-up.",
        )

    follow_up_repository.delete(
        db,
        follow_up,
    )
