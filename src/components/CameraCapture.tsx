import React, { useRef, useEffect, useState } from 'react';
import { X, Camera, RotateCcw } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageBlob: Blob) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: facingMode }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Unable to access camera. Please make sure you have granted camera permissions.');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            onCapture(blob);
          }
        }, 'image/jpeg');
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Take a Photo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="relative">
              <video ref={videoRef} autoPlay playsInline className="w-full mb-4 rounded" />
              <button
                onClick={toggleCamera}
                className="absolute top-2 right-2 bg-white bg-opacity-75 p-2 rounded-full"
              >
                <RotateCcw size={20} />
              </button>
            </div>
            <button
              onClick={captureImage}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
            >
              <Camera className="mr-2" size={20} />
              Capture
            </button>
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraCapture;