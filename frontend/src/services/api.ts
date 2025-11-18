/**
 * API Service Layer
 * Handles all communication with the FastAPI backend
 */

import type { DataProfileResponse, AnalysisError } from '../types/analysis';

// API base URL - change this based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Upload and analyze a data file
 * @param file - CSV or Excel file to analyze
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with analysis results
 */
export async function analyzeFile(
  file: File,
  onProgress?: (percentage: number) => void
): Promise<DataProfileResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/analysis/analyze`, {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header - browser sets it automatically with boundary
    });

    if (!response.ok) {
      const errorData: AnalysisError = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data: DataProfileResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while analyzing the file');
  }
}

/**
 * Check backend health status
 * @returns Promise with health status
 */
export async function checkHealth(): Promise<{ status: string; version: string; environment: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to connect to the backend');
  }
}
