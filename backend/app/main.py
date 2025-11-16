"""
FastAPI application entry point.
Configures routes, middleware, and CORS.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api import health, analysis
from app import __version__

# Create FastAPI app
app = FastAPI(
    title="DataSage API",
    description="AI-Powered Data Quality Assistant using Claude",
    version=__version__,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(
    analysis.router,
    prefix=f"{settings.API_V1_PREFIX}/analysis",
    tags=["Analysis"]
)


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "DataSage API",
        "version": __version__,
        "docs": "/docs",
        "health": "/health"
    }
