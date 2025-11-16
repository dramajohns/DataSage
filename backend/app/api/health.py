"""
Health check endpoint for monitoring application status.
"""
from fastapi import APIRouter

from app.schemas.analysis import HealthResponse
from app.core.config import settings
from app import __version__

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint.

    Returns application status, version, and environment.
    Useful for monitoring, load balancers, and deployment verification.
    """
    return HealthResponse(
        status="healthy",
        version=__version__,
        environment=settings.ENVIRONMENT
    )
