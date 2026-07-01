import React, { useEffect, useState } from 'react';
import { Brain, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { useAppStore } from '@/contexts/AppStore';
import { processingSteps } from '@/data/etrogData';

const ProcessingScreen: React.FC = () => {
  const { processingProgress, aiMode } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  const steps = processingSteps[aiMode];

  useEffect(() => {
    const stepIndex = Math.floor((processingProgress / 100) * steps.length);
    setCurrentStep(stepIndex);
    
    const stepProgress = ((processingProgress / 100) * steps.length - stepIndex) * 100;
    setStepProgress(Math.min(100, Math.max(0, stepProgress)));
  }, [processingProgress, steps.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
              <Zap className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">מעבד תמונה...</h1>
          <p className="text-gray-600">הבינה המלאכותית בוחנת את האתרוג</p>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">התקדמות כללית</span>
            <span className="text-sm font-bold text-blue-600">{processingProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${processingProgress}%` }}
            />
          </div>
        </div>

        {/* Current step */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              {stepProgress < 100 ? (
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                {steps[currentStep]?.name || 'מסיים...'}
              </h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-600">התקדמות שלב</span>
                <span className="text-sm font-bold text-blue-600">{Math.round(stepProgress)}%</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
        </div>

        {/* Steps overview */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-4">שלבי העיבוד</h3>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index < currentStep 
                    ? 'bg-green-500 text-white' 
                    : index === currentStep 
                    ? 'bg-blue-500 text-white animate-pulse' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-sm ${
                  index < currentStep 
                    ? 'text-green-600 font-medium' 
                    : index === currentStep 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Mode indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">
            <Brain className="w-4 h-4" />
            <span>
              מצב AI: {
                aiMode === 'comprehensive' ? 'מקיף' : 
                aiMode === 'standard' ? 'רגיל' : 'בסיסי'
              }
            </span>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">💡 טיפ:</p>
            <p>
              {aiMode === 'comprehensive' 
                ? 'המצב המקיף מספק ניתוח מעמיק עם דיוק מקסימלי'
                : aiMode === 'standard'
                ? 'המצב הרגיל מספק איזון טוב בין מהירות לדיוק'
                : 'המצב הבסיסי מהיר וחסכוני במשאבים'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingScreen; 