from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.ai import router as ai_router
from app.api.routes.auth import router as auth_router
from app.api.routes.applications import router as applications_router
from app.api.routes.companies import router as companies_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.follow_ups import router as follow_ups_router
from app.api.routes.resumes import router as resumes_router


app = FastAPI(
    title="ApplyPilot API",
    description="Backend API for ApplyPilot - an AI-powered internship application tracker.",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(ai_router)
app.include_router(auth_router)
app.include_router(applications_router)
app.include_router(companies_router)
app.include_router(dashboard_router)
app.include_router(follow_ups_router)
app.include_router(resumes_router)


@app.get("/api/health")
async def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "ApplyPilot API",
        "version": "0.1.0",
    }
