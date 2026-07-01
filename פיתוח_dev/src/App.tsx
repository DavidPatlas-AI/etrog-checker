import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from '@/contexts/AppStore';
import HomeScreen from '@/pages/HomeScreen';
import CameraScreen from '@/pages/CameraScreen';
import ProcessingScreen from '@/pages/ProcessingScreen';
import ResultScreen from '@/pages/ResultScreen';
import HistoryScreen from '@/pages/HistoryScreen';
import ErrorMessage from '@/components/ErrorMessage';
import Sidebar from '@/components/Sidebar';

const App: React.FC = () => {
  const { 
    currentView, 
    error, 
    setError, 
    sidebarOpen, 
    setSidebarOpen,
    darkMode 
  } = useAppStore();

  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      const { cameraStream } = useAppStore.getState();
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const renderCurrentScreen = () => {
    switch (currentView) {
      case 'camera':
        return <CameraScreen />;
      case 'processing':
        return <ProcessingScreen />;
      case 'result':
        return <ResultScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'analytics':
      case 'inventory':
      case 'settings':
        return (
          <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 flex items-center justify-center`}>
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>בפיתוח</h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>התכונה הזו תהיה זמינה בקרוב</p>
              <button 
                onClick={() => useAppStore.getState().setCurrentView('home')}
                className="btn-primary"
              >
                חזור למסך הראשי
              </button>
            </div>
          </div>
        );
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {renderCurrentScreen()}
      
      {/* Error Message */}
      <ErrorMessage />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Backdrop for sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: '',
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default App; 