import React, { useRef, useState } from 'react';
import { Upload, Camera } from 'lucide-react';
import CameraCapture from './CameraCapture';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleCameraCapture = (imageBlob: Blob) => {
    const file = new File([imageBlob], "camera_capture.jpg", { type: "image/jpeg" });
    onImageUpload(file);
    setShowCamera(false);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Click to upload or drag and drop
        </p>
        <p className="text-xs sm:text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
      </div>

      <button
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
        onClick={() => setShowCamera(true)}
      >
        <Camera className="mr-2" size={20} />
        Take Photo
      </button>

      {showCamera && (
        <CameraCapture onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />
      )}
    </div>
  );
};

export default ImageUploader;