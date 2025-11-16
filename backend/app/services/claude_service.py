"""
Service for interacting with Claude API.
Handles prompt engineering, API calls, and response parsing.
"""
from anthropic import Anthropic
from typing import Dict, Any
import json

from app.core.config import settings


class ClaudeService:
    """Service class for Claude API interactions."""

    def __init__(self):
        """Initialize Claude client with API key from settings."""
        self.client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.model = "claude-sonnet-4-5-20250929"  # Claude Sonnet 4.5 (latest, smartest)

    def analyze_data_profile(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze data profile and generate insights using Claude.

        Args:
            profile_data: Dictionary containing data profile information
                         (row_count, column_count, columns with stats)

        Returns:
            Dictionary with:
                - insights: Natural language analysis
                - quality_score: Overall quality score (0-100)
                - recommendations: List of actionable recommendations

        Example:
            profile = {
                "row_count": 1000,
                "column_count": 5,
                "columns": [{"name": "age", "null_count": 50, ...}]
            }
            result = service.analyze_data_profile(profile)
        """
        # Build prompt asking Claude to analyze data quality
        prompt = f"""You are a data quality expert. Analyze the following dataset profile and provide insights.

Data Profile:
{json.dumps(profile_data, indent=2)}

Provide your analysis in JSON format with these exact keys:
- "insights": A 2-3 sentence summary of overall data quality
- "quality_score": A number from 0-100 representing overall quality
- "recommendations": A list of 2-5 actionable recommendations for improvement

IMPORTANT: Respond with ONLY the raw JSON object. Do NOT wrap it in markdown code blocks or add any other text."""

        # Call Claude API
        message = self.client.messages.create(
            model=self.model,
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        # Extract and parse response
        result_text = message.content[0].text.strip()

        # Remove markdown code blocks if present (```json ... ```)
        if result_text.startswith("```"):
            # Find the actual JSON content between the code fences
            lines = result_text.split('\n')
            # Remove first line (```json or ```) and last line (```)
            json_lines = []
            in_content = False
            for line in lines:
                if line.strip().startswith("```") and not in_content:
                    in_content = True
                    continue
                elif line.strip() == "```" and in_content:
                    break
                elif in_content:
                    json_lines.append(line)
            result_text = '\n'.join(json_lines)

        try:
            result_json = json.loads(result_text)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse Claude response as JSON: {e}\nResponse: {result_text}")

        return result_json

    def generate_sql_query(self, natural_language_query: str, schema_info: Dict[str, Any]) -> str:
        """
        Generate SQL query from natural language description.

        Args:
            natural_language_query: User's description of what they want to query
            schema_info: Database schema information (table names, columns, types)

        Returns:
            Generated SQL query as string

        Example:
            query = service.generate_sql_query(
                "Show me total sales by region",
                {"tables": [{"name": "sales", "columns": ["region", "amount"]}]}
            )
        """
        # We'll implement this later in Phase 2
        raise NotImplementedError("SQL generation coming in Phase 2")

    def debug_error(self, error_message: str, context: Dict[str, Any]) -> str:
        """
        Analyze error message and provide debugging suggestions.

        Args:
            error_message: The error message to analyze
            context: Additional context (code snippet, stack trace, etc.)

        Returns:
            Debugging suggestions and possible solutions
        """
        # We'll implement this later in Phase 2
        raise NotImplementedError("Error debugging coming in Phase 2")
