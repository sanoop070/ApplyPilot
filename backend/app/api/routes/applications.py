from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models.application import Application
from app.models.user import User
from app.repositories.application_repository import application_repository
from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationUpdate,
)
from app.schemas.application_status import ApplicationStatusUpdate
from app.schemas.recommendation import RecommendationResponse
from app.services.application_ai_service import application_ai_service


router = APIRouter(
    prefix="/api/applications",
    tags=["Applications"],
)


@router.post(
    "",
    response_model=ApplicationResponse,
    status_code=201,
)
def create_application(
    application_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApplicationResponse:
    application = Application(
        **application_data.model_dump(),
        user_id=current_user.id,
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return application


@router.get(
    "",
    response_model=list[ApplicationResponse],
)
def get_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[ApplicationResponse]:
    return application_repository.get_all(
        db,
        current_user.id,
    )


@router.get(
    "/{application_id}/analysis",
    response_model=RecommendationResponse,
)
def get_application_analysis(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> RecommendationResponse:
    application = application_repository.get_by_id(
        db,
        application_id,
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

    analysis = application_ai_service.get_analysis(
        application
    )

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="No AI recommendation is available for this application.",
        )

    return analysis


@router.get(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def get_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApplicationResponse:
    application = application_repository.get_by_id(
        db,
        application_id,
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

    return application


@router.patch(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def update_application(
    application_id: int,
    application_data: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApplicationResponse:
    application = application_repository.get_by_id(
        db,
        application_id,
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

    return application_repository.update(
        db,
        application,
        application_data,
    )


@router.patch(
    "/{application_id}/status",
    response_model=ApplicationResponse,
)
def update_application_status(
    application_id: int,
    status_data: ApplicationStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApplicationResponse:
    application = application_repository.get_by_id(
        db,
        application_id,
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

    application.status = status_data.status

    db.commit()
    db.refresh(application)

    return application


@router.post(
    "/{application_id}/analyze",
    response_model=ApplicationResponse,
)
def analyze_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApplicationResponse:
    application = application_repository.get_by_id(
        db,
        application_id,
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

    try:
        return application_ai_service.analyze_application(
            db=db,
            application=application,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Unable to analyze this application.",
        ) from exc


@router.post(
    "/{application_id}/recommend",
    response_model=ApplicationResponse,
)
def recommend_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApplicationResponse:
    application = application_repository.get_by_id(
        db,
        application_id,
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

    try:
        return application_ai_service.recommend_application(
            db=db,
            application=application,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Unable to generate an application recommendation.",
        ) from exc


@router.delete(
    "/{application_id}",
    status_code=204,
)
def delete_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    application = application_repository.get_by_id(
        db,
        application_id,
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

    application_repository.delete(
        db,
        application,
    )
