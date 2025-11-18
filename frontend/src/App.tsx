import { useState } from 'react';
import FileUpload from './components/FileUpload';
import DataProfile from './components/DataProfile';
import AIInsights from './components/AIInsights';
import { analyzeFile } from './services/api';
import type { DataProfileResponse } from './types/analysis';

function App() {
  const [analysisResult, setAnalysisResult] = useState<DataProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeFile(file);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setSelectedFile(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">🔮</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DataSage</h1>
                <p className="text-sm text-gray-600">AI-Powered Data Quality Assistant</p>
              </div>
            </div>

            {analysisResult && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Analyze New File
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!analysisResult && !isLoading && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Upload Your Data File
              </h2>
              <p className="text-lg text-gray-600">
                Get instant AI-powered insights about your data quality, missing values, and recommendations for improvement.
              </p>
            </div>

            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🔮</span>
              </div>
            </div>
            <p className="mt-6 text-lg font-semibold text-gray-700">
              Analyzing {selectedFile?.name}...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Claude AI is reviewing your data
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Analysis Failed
                  </h3>
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={handleReset}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {analysisResult && !isLoading && (
          <div className="space-y-8 animate-fade-in">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-6xl mx-auto">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-green-800 font-medium">
                  Analysis complete! Here are your results:
                </p>
              </div>
            </div>

            <DataProfile data={analysisResult} />
            <AIInsights data={analysisResult} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Powered by <span className="font-semibold">Claude Sonnet 4.5</span> • Built with React + TypeScript + Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
