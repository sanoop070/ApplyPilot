import json

from sqlalchemy.orm import Session

from app.models.application import Application
from app.repositories.resume_repository import resume_repository
from app.schemas.recommendation import RecommendationResponse
from app.services.job_analysis_service import job_analysis_service
from app.services.recommendation_service import recommendation_service


class ApplicationAIService:
    @staticmethod
    def analyze_application(
        db: Session,
        application: Application,
    ) -> Application:
        if not application.job_description:
            raise ValueError(
                "This application does not have a job description."
            )

        analysis = job_analysis_service.analyze(
            application.job_description
        )

        application.ai_summary = analysis.summary
        application.ai_fit_score = analysis.fit_score
        application.ai_analysis = analysis.model_dump_json()

        db.commit()
        db.refresh(application)

        return application

    @staticmethod
    def recommend_application(
        db: Session,
        application: Application,
    ) -> Application:
        if not application.job_description:
            raise ValueError(
                "This application does not have a job description."
            )

        resume = resume_repository.get_by_user_id(
            db,
            application.user_id,
        )

        if resume is None:
            raise ValueError(
                "Please save a resume before generating a recommendation."
            )

        recommendation = recommendation_service.recommend(
            resume_text=resume.resume_text,
            job_description=application.job_description,
        )

        application.ai_summary = recommendation.recommendation
        application.ai_fit_score = recommendation.match_score
        application.ai_analysis = recommendation.model_dump_json()

        db.commit()
        db.refresh(application)

        return application

    @staticmethod
    def get_analysis(
        application: Application,
    ) -> RecommendationResponse | None:
        if not application.ai_analysis:
            return None

        try:
            data = json.loads(application.ai_analysis)

            return RecommendationResponse.model_validate(data)

        except (json.JSONDecodeError, ValueError):
            return None


application_ai_service = ApplicationAIService()
