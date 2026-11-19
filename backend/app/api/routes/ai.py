from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.ai import JobAnalysisRequest, JobAnalysisResponse
from app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationResponse,
)
from app.services.job_analysis_service import job_analysis_service
from app.services.recommendation_service import recommendation_service


router = APIRouter(
    prefix="/api/ai",
    tags=["AI"],
)


@router.post(
    "/analyze-job",
    response_model=JobAnalysisResponse,
)
def analyze_job(
    request: JobAnalysisRequest,
) -> JobAnalysisResponse:
    try:
        return job_analysis_service.analyze(
            request.job_description
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Unable to analyze the job description.",
        ) from exc


@router.post(
    "/recommend",
    response_model=RecommendationResponse,
)
def recommend(
    request: RecommendationRequest,
    current_user: User = Depends(get_current_user),
) -> RecommendationResponse:
    try:
        return recommendation_service.recommend(
            resume_text=request.resume_text,
            job_description=request.job_description,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Unable to generate the recommendation.",
        ) from exc
