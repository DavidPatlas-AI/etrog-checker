import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useAppStore } from '@/contexts/AppStore';

const ErrorMessage: React.FC = () => {
  const { error, setError } = useAppStore();

  if (!error) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
        <button 
          onClick={() => setError(null)} 
          className="text-red-500 hover:text-red-700 ml-2 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage; 