import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
}

export default function FileUpload({
  onFileSelect,
  accept = '.csv,.xlsx,.xls',
  maxSizeMB = 10
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TODO(human): Implement file validation logic
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Your task: Add validation for file type and size
    // Hint: Check file.type or file.name extension matches accept prop
    // Hint: Convert maxSizeMB to bytes (1 MB = 1024 * 1024 bytes)
    // Return { valid: true } if valid, or { valid: false, error: 'message' } if invalid

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit.` };
    }

    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim().toLowerCase());
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type.slice(1);
        }
        return file.type === type;
      });

      if (!isAccepted) {
        return { valid: false, error: 'Unsupported file type.' };
      }
    } 

    return { valid: true }; // Placeholder - replace with actual validation
  };

  const handleFile = (file: File) => {
    const validation = validateFile(file);

    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError(null);
    onFileSelect(file);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragging
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="space-y-4">
          {/* Upload Icon */}
          <div className="flex justify-center">
            <svg
              className={`w-16 h-16 transition-colors ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {/* Text */}
          <div>
            <p className="text-lg font-semibold text-gray-700">
              {isDragging ? 'Drop your file here' : 'Drag & drop your data file'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supports CSV, Excel (max {maxSizeMB}MB)
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            <span className="font-semibold">Error:</span> {error}
          </p>
        </div>
      )}
    </div>
  );
}
