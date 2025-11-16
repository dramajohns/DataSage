"""
API endpoints for data analysis operations.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Any
import uuid

from app.services.data_profiler import DataProfiler
from app.services.claude_service import ClaudeService
from app.services.mock_claude_service import MockClaudeService
from app.schemas.analysis import DataProfileResponse, ColumnProfile
from app.core.config import settings
from datetime import datetime

router = APIRouter()

# Initialize services
data_profiler = DataProfiler()
# Using real Claude API (Claude 3 Haiku - fast and cost-effective)
claude_service = ClaudeService()
# claude_service = MockClaudeService()  # Uncomment to use mock for testing


@router.post("/analyze", response_model=DataProfileResponse)
async def analyze_file(file: UploadFile = File(...)) -> Any:
    """
    Upload and analyze a data file (CSV or Excel).

    Steps:
    1. Validate file type and size
    2. Read file into DataFrame
    3. Generate data profile (stats, nulls, types)
    4. Send profile to Claude for AI insights
    5. Return comprehensive analysis

    Args:
        file: Uploaded file (CSV or Excel format)

    Returns:
        DataProfileResponse with profile stats and AI insights

    Raises:
        HTTPException: If file is invalid or processing fails
    """
    # Validate file type
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    file_extension = file.filename.split('.')[-1].lower()
    if file_extension not in settings.ALLOWED_FILE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Supported: {', '.join(settings.ALLOWED_FILE_TYPES)}"
        )

    # Read file content
    content = await file.read()

    # Validate file size
    file_size_mb = len(content) / (1024 * 1024)
    if file_size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max size: {settings.MAX_FILE_SIZE_MB}MB"
        )

    try:
        # Read file into DataFrame
        df = data_profiler.read_file(content, file.filename)

        # Generate data profile
        profile = data_profiler.profile_dataframe(df)

        # Get AI insights from Claude
        ai_analysis = claude_service.analyze_data_profile(profile)

        # Build response
        return DataProfileResponse(
            id=str(uuid.uuid4()),
            file_name=file.filename,
            row_count=profile["row_count"],
            column_count=profile["column_count"],
            columns=[ColumnProfile(**col) for col in profile["columns"]],
            ai_insights=ai_analysis["insights"],
            quality_score=ai_analysis.get("quality_score"),
            recommendations=ai_analysis.get("recommendations", []),
            created_at=datetime.utcnow()
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
