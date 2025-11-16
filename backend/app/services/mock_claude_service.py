"""
Mock Claude service for testing without API key.
Provides realistic responses without calling the actual API.
"""
from typing import Dict, Any


class MockClaudeService:
    """Mock service that simulates Claude API responses."""

    def analyze_data_profile(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate mock insights based on the data profile.
        This simulates what Claude would return.
        """
        row_count = profile_data.get("row_count", 0)
        column_count = profile_data.get("column_count", 0)
        columns = profile_data.get("columns", [])

        # Calculate quality score based on null percentages
        total_null_pct = sum(col.get("null_percentage", 0) for col in columns)
        avg_null_pct = total_null_pct / len(columns) if columns else 0
        quality_score = max(0, 100 - (avg_null_pct * 2))

        # Generate insights
        insights = f"Your dataset contains {row_count} rows and {column_count} columns. "

        if avg_null_pct > 10:
            insights += f"Data quality needs attention - average null rate is {avg_null_pct:.1f}%. "
        elif avg_null_pct > 5:
            insights += "Data quality is moderate with some missing values. "
        else:
            insights += "Data quality is excellent with minimal missing values. "

        # Generate recommendations
        recommendations = []

        for col in columns:
            null_pct = col.get("null_percentage", 0)
            if null_pct > 10:
                recommendations.append(
                    f"Column '{col['name']}' has {null_pct:.1f}% missing values - consider imputation or investigation"
                )

        if not recommendations:
            recommendations.append("Data appears clean - proceed with analysis")
            recommendations.append("Consider checking for outliers in numeric columns")

        if len(columns) > 10:
            recommendations.append("Large number of columns - consider dimensionality reduction")

        return {
            "insights": insights,
            "quality_score": round(quality_score, 1),
            "recommendations": recommendations[:5]  # Limit to 5
        }
