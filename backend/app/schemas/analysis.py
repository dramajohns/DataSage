"""
Pydantic schemas for data analysis requests and responses.
These define the shape of data going in/out of the API.
"""
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime


class DataProfileRequest(BaseModel):
    """Request schema for data profiling."""
    file_name: str = Field(..., description="Name of the uploaded file")
    file_size: int = Field(..., description="Size of file in bytes")


class ColumnProfile(BaseModel):
    """Profile information for a single column."""
    name: str
    dtype: str
    null_count: int
    null_percentage: float
    unique_count: int
    sample_values: List[Any]


class DataProfileResponse(BaseModel):
    """Response schema containing data profile and AI insights."""
    id: str
    file_name: str
    row_count: int
    column_count: int
    columns: List[ColumnProfile]
    ai_insights: str = Field(..., description="Claude-generated insights")
    quality_score: Optional[float] = Field(None, ge=0, le=100)
    recommendations: List[str]
    created_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "file_name": "sales_data.csv",
                "row_count": 1000,
                "column_count": 5,
                "columns": [],
                "ai_insights": "Your dataset shows strong data quality...",
                "quality_score": 85.5,
                "recommendations": ["Consider handling missing values in 'price' column"],
                "created_at": "2024-01-01T00:00:00Z"
            }
        }


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    version: str
    environment: str
