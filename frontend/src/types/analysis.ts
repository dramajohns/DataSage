/**
 * TypeScript types matching backend Pydantic schemas
 * These ensure type safety when communicating with the FastAPI backend
 */

export interface ColumnProfile {
  name: string;
  dtype: string;
  null_count: number;
  null_percentage: number;
  unique_count: number;
  sample_values: (string | number | boolean | null)[];
}

export interface DataProfileResponse {
  id: string;
  file_name: string;
  row_count: number;
  column_count: number;
  columns: ColumnProfile[];
  ai_insights: string;
  quality_score: number;
  recommendations: string[];
  created_at: string;
}

export interface AnalysisError {
  detail: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
