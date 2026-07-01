import React, { useRef, useEffect, useState } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Settings,
  Camera as CameraIcon,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAppStore } from '@/contexts/AppStore';
import { cameraSettings } from '@/data/etrogData';
import toast from 'react-hot-toast';

const CameraScreen: React.FC = () => {
  const {
    cameraStream,
    setCameraStream,
    setCurrentView,
    setCapturedImage,
    setIsProcessing,
    cameraFacing,
    setCameraFacing,
    imageQuality,
    setImageQuality,
    aiMode,
    setAiMode,
    batchMode,
    currentBatch
  } = useAppStore();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const goBack = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCurrentView('home');
  };

  const switchCamera = async () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }

    try {
      const newFacing = cameraFacing === 'environment' ? 'user' : 'environment';
      setCameraFacing(newFacing);

      const constraints = {
        video: {
          facingMode: newFacing,
          width: { ideal: cameraSettings[imageQuality].width },
          height: { ideal: cameraSettings[imageQuality].height },
          frameRate: { ideal: cameraSettings[imageQuality].frameRate }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
    } catch (error) {
      toast.error('שגיאה בהחלפת מצלמה');
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    setIsProcessing(true);
    setCurrentView('processing');

    // Simulate AI processing
    useAppStore.getState().simulateAIClassification(imageData).then(result => {
      useAppStore.getState().setResult(result);
      useAppStore.getState().setCurrentView('result');
    });
  };

  const toggleMute = () => {
    if (cameraStream) {
      const audioTracks = cameraStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />

        {/* Enhanced camera guide overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Main guide frame */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-green-400 rounded-xl">
            {/* Corner markers */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-green-300 rounded-tl-xl"></div>
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-green-300 rounded-tr-xl"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-green-300 rounded-bl-xl"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-green-300 rounded-br-xl"></div>

            {/* Center crosshair */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-0.5 bg-green-400 absolute -translate-x-1/2"></div>
              <div className="h-8 w-0.5 bg-green-400 absolute -translate-y-1/2"></div>
            </div>
          </div>

          {/* Quality indicators */}
          <div className="absolute top-20 left-4 right-4 text-center">
            <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg backdrop-blur-sm inline-block">
              <div className="text-sm font-medium">מקם את האתרוג במרכז המסגרת</div>
              <div className="text-xs opacity-80">
                איכות: {imageQuality === 'high' ? 'גבוהה' : 'בינונית'} •
                מצב: {aiMode === 'comprehensive' ? 'מקיף' : aiMode === 'standard' ? 'רגיל' : 'בסיסי'}
              </div>
            </div>
          </div>
        </div>

        {/* Top controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button
            onClick={goBack}
            className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-80 transition-all backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            חזור
          </button>

          <div className="flex gap-2">
            <button
              onClick={switchCamera}
              className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all backdrop-blur-sm"
              title="החלף מצלמה"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all backdrop-blur-sm"
              title="הגדרות"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={toggleMute}
              className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all backdrop-blur-sm"
              title={isMuted ? 'הפעל קול' : 'השתק'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="absolute top-20 left-4 right-4 bg-black bg-opacity-80 backdrop-blur-sm rounded-lg p-4 text-white">
            <h3 className="font-semibold mb-3">הגדרות מצלמה</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">איכות תמונה</label>
                <select
                  value={imageQuality}
                  onChange={(e) => setImageQuality(e.target.value as any)}
                  className="w-full p-2 bg-gray-800 rounded text-sm"
                >
                  <option value="high">גבוהה</option>
                  <option value="medium">בינונית</option>
                  <option value="low">נמוכה</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">מצב AI</label>
                <select
                  value={aiMode}
                  onChange={(e) => setAiMode(e.target.value as any)}
                  className="w-full p-2 bg-gray-800 rounded text-sm"
                >
                  <option value="basic">בסיסי</option>
                  <option value="standard">רגיל</option>
                  <option value="comprehensive">מקיף</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-8 left-4 right-4 flex justify-center">
          <button
            onClick={captureImage}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
          >
            <CameraIcon className="w-10 h-10 text-gray-800" />
          </button>
        </div>

        {/* Batch mode indicator */}
        {batchMode && (
          <div className="absolute bottom-24 left-4 right-4 text-center">
            <div className="bg-orange-600 text-white px-4 py-2 rounded-lg inline-block">
              <div className="text-sm font-medium">מצב קבוצתי פעיל</div>
              <div className="text-xs opacity-80">
                {currentBatch && currentBatch.length} תמונות במערכת
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraScreen; 