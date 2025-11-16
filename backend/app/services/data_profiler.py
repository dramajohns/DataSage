"""
Service for profiling data from uploaded files.
Uses pandas to analyze data structure and statistics.
"""
import pandas as pd
from typing import Dict, Any, List
import io


class DataProfiler:
    """Service for generating data profiles from uploaded files."""

    @staticmethod
    def profile_dataframe(df: pd.DataFrame) -> Dict[str, Any]:
        """
        Generate comprehensive profile of a pandas DataFrame.

        Args:
            df: Pandas DataFrame to profile

        Returns:
            Dictionary containing:
                - row_count: Number of rows
                - column_count: Number of columns
                - columns: List of column profiles with statistics
        """
        columns_profile = []

        for col in df.columns:
            # Basic statistics for each column
            null_count = int(df[col].isnull().sum())
            total_rows = len(df)

            column_info = {
                "name": str(col),
                "dtype": str(df[col].dtype),
                "null_count": null_count,
                "null_percentage": round((null_count / total_rows) * 100, 2) if total_rows > 0 else 0,
                "unique_count": int(df[col].nunique()),
                "sample_values": df[col].dropna().head(5).tolist()
            }

            columns_profile.append(column_info)

        return {
            "row_count": len(df),
            "column_count": len(df.columns),
            "columns": columns_profile
        }

    @staticmethod
    def read_file(file_content: bytes, file_name: str) -> pd.DataFrame:
        """
        Read uploaded file into pandas DataFrame.

        Args:
            file_content: Raw bytes of uploaded file
            file_name: Name of file (used to determine format)

        Returns:
            Pandas DataFrame

        Raises:
            ValueError: If file format is not supported
        """
        if file_name.endswith('.csv'):
            return pd.read_csv(io.BytesIO(file_content))
        elif file_name.endswith(('.xlsx', '.xls')):
            return pd.read_excel(io.BytesIO(file_content))
        else:
            raise ValueError(f"Unsupported file format: {file_name}")
