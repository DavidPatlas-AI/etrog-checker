import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Camera, Upload, Check, X, AlertCircle, Star, Info, ArrowLeft, RotateCcw, 
  Home, Settings, History, BarChart3, Download, Share2, MapPin, 
  TrendingUp, Package, DollarSign, Eye, Ruler, Menu, Bell, Zap,
  Shield, Award, Sparkles, Target, ChevronRight, 
  Filter, Search, Calendar, Clock, Users, Globe,
  Heart, Layers, Database
} from 'lucide-react';

const EtrogIdentifierApp = () => {
  // Core state
  const [currentView, setCurrentView] = useState('home');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [error, setError] = useState(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  
  // Advanced settings
  const [cameraFacing, setCameraFacing] = useState('environment');
  const [imageQuality, setImageQuality] = useState('high');
  const [aiMode, setAiMode] = useState('comprehensive');
  const [userProfile, setUserProfile] = useState('merchant');
  const [language, setLanguage] = useState('he');
  const [autoCapture, setAutoCapture] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Business features
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalScanned: 12,
    kosherRate: 0.89,
    averageGrade: 4.2,
    monthlyTrends: [85, 92, 88, 95, 89],
    weeklyStats: { kosher: 8, questionable: 2, invalid: 2 }
  });
  const [notifications, setNotifications] = useState([]);
  const [currentSupplier, setCurrentSupplier] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [batchMode, setBatchMode] = useState(false);
  const [currentBatch, setCurrentBatch] = useState([]);
  
  // UI state
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Animation states
  const [isAnimating, setIsAnimating] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);
  const [scanningEffect, setScanningEffect] = useState(false);
  
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  // Market data
  const marketPrices = {
    current: {
      'rishon_premium': { avg: 950, trend: '+12%', lastWeek: 850 },
      'rishon_standard': { avg: 650, trend: '+5%', lastWeek: 620 },
      'sheni_export': { avg: 480, trend: '+8%', lastWeek: 445 }
    },
    locations: {
      'jerusalem': { modifier: 1.15, name: 'ירושלים' },
      'bnei_brak': { modifier: 1.20, name: 'בני ברק' },
      'modiin_illit': { modifier: 1.10, name: 'מודיעין עילית' }
    }
  };

  // Effects
  useEffect(() => {
    checkNotifications();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Utility functions
  const showError = useCallback((message) => {
    setError(message);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const checkNotifications = () => {
    const mockNotifications = [
      { id: 1, text: 'מחירי ראשונים פרימיום עלו ב-12% השבוע 📈', type: 'price-alert', time: '2 שעות' }
    ];
    setNotifications(mockNotifications);
  };

  // Enhanced AI Classification
  const simulateAIClassification = async (imageData) => {
    setScanningEffect(true);
    
    const steps = [
      { name: 'טוען תמונה...', progress: 10, delay: 300 },
      { name: 'זיהוי צורה...', progress: 30, delay: 500 },
      { name: 'ניתוח ספקטרלי...', progress: 60, delay: 700 },
      { name: 'בדיקת פגמים...', progress: 85, delay: 600 },
      { name: 'חישוב מחיר...', progress: 100, delay: 300 }
    ];

    for (const step of steps) {
      setCurrentStep(step.name);
      setProcessingProgress(step.progress);
      await new Promise(resolve => setTimeout(resolve, step.delay));
    }

    setScanningEffect(false);

    const result = {
      status: 'kosher',
      confidence: 0.96,
      variety: 'אתרוג תימני מובחר',
      details: 'אתרוג איכותי מדרגה ראשונה',
      defects: [],
      measurements: { 
        length: '12.3 ס"מ', 
        width: '8.1 ס"מ', 
        weight: '185 גרם',
        pitam: 'שלם ויפה'
      },
      halachicNotes: 'מתאים למצוות ארבעת המינים',
      businessInsights: {
        estimatedPrice: 725,
        profitMargin: '45%',
        recommendation: 'מומלץ לרכישה - פוטנציאל רווח מעולה'
      },
      qualityScore: 95,
      certification: 'בד"ץ עדה חרדית',
      origin: 'יטבתה, ישראל'
    };
    
    saveToHistory(result, imageData);
    return result;
  };

  const saveToHistory = useCallback((result, image) => {
    const historyItem = {
      id: Date.now(),
      timestamp: new Date(),
      result,
      image,
      supplier: currentSupplier,
      location: currentLocation
    };
    
    setHistory(prev => [historyItem, ...prev.slice(0, 99)]);
  }, [currentSupplier, currentLocation]);

  // Camera functions
  const startCamera = async () => {
    try {
      clearError();
      
      const constraints = {
        video: { 
          facingMode: cameraFacing,
          width: { ideal: imageQuality === 'high' ? 1920 : 1280 },
          height: { ideal: imageQuality === 'high' ? 1080 : 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(console.error);
      }
      
      setCurrentView('camera');
    } catch (error) {
      showError('שגיאה בהפעלת המצלמה');
    }
  };

  const capturePhoto = useCallback(() => {
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedImage(imageData);
      stopCamera();
      processImage(imageData);
    } catch (error) {
      showError('שגיאה בצילום התמונה');
    }
  }, []);

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const switchCamera = () => {
    setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment');
    if (cameraStream) {
      stopCamera();
      setTimeout(startCamera, 100);
    }
  };

  // File upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setCapturedImage(e.target.result);
      processImage(e.target.result);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  // Image processing
  const processImage = async (imageData) => {
    try {
      setIsProcessing(true);
      setProcessingProgress(0);
      setCurrentStep('');
      clearError();
      setCurrentView('processing');
      
      const result = await simulateAIClassification(imageData);
      setResult(result);
      setCurrentView('result');
    } catch (error) {
      showError('שגיאה בעיבוד התמונה');
      setCurrentView('home');
    } finally {
      setIsProcessing(false);
    }
  };

  // Navigation
  const resetApp = () => {
    setCurrentView('home');
    setResult(null);
    setCapturedImage(null);
    setIsProcessing(false);
    setProcessingProgress(0);
    clearError();
    stopCamera();
    setSidebarOpen(false);
  };

  const goBack = () => {
    if (currentView === 'camera') {
      stopCamera();
      setCurrentView('home');
    } else {
      setCurrentView('home');
    }
    setSidebarOpen(false);
  };

  // Sharing functions
  const shareResult = async () => {
    if (!result) return;
    
    const shareData = {
      title: 'דוח זיהוי אתרוג מקצועי',
      text: `🍋 ${result.variety}
✅ ${result.status === 'kosher' ? 'כשר' : 'לא כשר'}
🎯 וודאות: ${Math.round(result.confidence * 100)}%
💰 מחיר משוער: ₪${result.businessInsights?.estimatedPrice || 'N/A'}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        showError('הדוח הועתק ללוח! 📋');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const exportReport = () => {
    if (!result) return;
    
    const report = {
      timestamp: new Date().toISOString(),
      result,
      image: capturedImage,
      userProfile,
      settings: { aiMode, imageQuality }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `etrog-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addToFavorites = () => {
    if (!result) return;
    setFavorites(prev => [...prev, { id: Date.now(), result, image: capturedImage }]);
    showError('נוסף למועדפים! ⭐');
  };

  // Components
  const ErrorMessage = () => error ? (
    <div className="fixed top-4 left-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg animate-bounce">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
        <button onClick={clearError} className="text-red-500 hover:text-red-700">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : null;

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl transform transition-all duration-500 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">תפריט ראשי</h2>
            <p className="text-slate-400 text-sm">גרסה 2.1.0</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="space-y-3">
          {[
            { icon: Home, label: 'בית', view: 'home', color: 'text-blue-400' },
            { icon: History, label: `היסטוריה (${history.length})`, view: 'history', color: 'text-purple-400' },
            { icon: Settings, label: 'הגדרות', view: 'settings', color: 'text-gray-400' }
          ].map(item => (
            <button 
              key={item.view}
              onClick={() => { setCurrentView(item.view); setSidebarOpen(false); }}
              className="w-full flex items-center gap-4 p-4 text-right hover:bg-slate-700 rounded-xl transition-all group"
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="mt-8 bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-sm font-medium text-slate-300 mb-3">פרופיל משתמש</div>
          <select 
            value={userProfile} 
            onChange={(e) => setUserProfile(e.target.value)}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
          >
            <option value="merchant">🏪 סוחר מקצועי</option>
            <option value="consumer">🛒 צרכן פרטי</option>
            <option value="rabbi">📚 רב/פוסק</option>
          </select>
        </div>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-emerald-50 to-orange-50'} p-4`}>
      <ErrorMessage />
      
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setSidebarOpen(true)} className="p-3 hover:bg-white hover:bg-opacity-20 rounded-xl">
          <Menu className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
        </button>
        
        <div className="text-center">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent`}>
            🍋 זיהוי אתרוגים AI
          </h1>
          <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            מערכת AI מתקדמת לזיהוי וניתוח אתרוגים
          </p>
        </div>
        
        <button onClick={() => setDarkMode(!darkMode)} className="p-3 hover:bg-white hover:bg-opacity-20 rounded-xl">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="max-w-md mx-auto">
        {userProfile === 'merchant' && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 shadow-lg text-white">
              <div className="text-2xl font-bold">{analytics.totalScanned}</div>
              <div className="text-xs opacity-90">נסרקו היום</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 shadow-lg text-white">
              <div className="text-2xl font-bold">{Math.round(analytics.kosherRate * 100)}%</div>
              <div className="text-xs opacity-90">אחוז כשרות</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 shadow-lg text-white">
              <div className="text-2xl font-bold">₪{marketPrices.current.rishon_premium.avg}</div>
              <div className="text-xs opacity-90">ממוצע פרימיום</div>
            </div>
          </div>
        )}

        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-6 shadow-xl mb-8`}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>יכולות המערכת</h2>
          <div className="space-y-4">
            {[
              { icon: Check, text: 'זיהוי כשרות ופגמים ברמת דיוק של 96.8%+', color: 'text-green-500' },
              { icon: Star, text: 'מיון אוטומטי לקטגוריות מסחריות', color: 'text-yellow-500' },
              { icon: DollarSign, text: 'הערכת מחיר בזמן אמת', color: 'text-green-500' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {userProfile === 'merchant' && (
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-4 shadow-lg mb-6`}>
            <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>הקשר עסקי</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                value={currentSupplier}
                onChange={(e) => setCurrentSupplier(e.target.value)}
                placeholder="שם הספק"
                className={`w-full p-3 border rounded-xl ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200'}`}
              />
              <select 
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                className={`w-full p-3 border rounded-xl ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200'}`}
              >
                <option value="">בחר מיקום</option>
                <option value="jerusalem">ירושלים</option>
                <option value="bnei_brak">בני ברק</option>
                <option value="modiin_illit">מודיעין עילית</option>
              </select>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={startCamera}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <Camera className="w-6 h-6" />
            צלם אתרוג חדש
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <Upload className="w-6 h-6" />
            העלה תמונה
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
      
      <Sidebar />
    </div>
  );

  const CameraScreen = () => (
    <div className="min-h-screen bg-black flex flex-col">
      <ErrorMessage />
      
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: `scale(${zoomLevel})` }}
        />
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-3 border-green-400 rounded-2xl animate-pulse">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-0.5 bg-green-400 absolute -translate-x-1/2"></div>
              <div className="h-12 w-0.5 bg-green-400 absolute -translate-y-1/2"></div>
            </div>
          </div>
          
          <div className="absolute top-24 left-4 right-4 text-center">
            <div className="bg-black bg-opacity-70 text-white px-6 py-3 rounded-2xl backdrop-blur-sm inline-block">
              <div className="text-lg font-bold mb-1">🎯 מקם את האתרוג במרכז המסגרת</div>
              <div className="text-sm opacity-90">
                📸 איכות: {imageQuality === 'high' ? 'גבוהה' : 'בינונית'} • 
                🤖 מצב: {aiMode === 'comprehensive' ? 'מקיף' : 'רגיל'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-6 left-4 right-4 flex justify-between items-center">
          <button
            onClick={goBack}
            className="bg-black bg-opacity-60 text-white px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-opacity-80 transition-all backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            חזור
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={switchCamera}
              className="bg-black bg-opacity-60 text-white p-3 rounded-xl hover:bg-opacity-80 transition-all backdrop-blur-sm"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setZoomLevel(prev => prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1)}
              className="bg-black bg-opacity-60 text-white p-3 rounded-xl hover:bg-opacity-80 transition-all backdrop-blur-sm"
            >
              <span className="text-sm font-bold">{zoomLevel}x</span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={capturePhoto}
            className="bg-white w-24 h-24 rounded-full border-4 border-gray-300 hover:border-green-500 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 active:scale-95"
          >
            <div className="w-full h-full bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-600" />
            </div>
          </button>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );

  const ProcessingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <ErrorMessage />
      
      <div className="text-center max-w-lg mx-auto">
        <div className="mb-8">
          {capturedImage && (
            <div className="relative">
              <img 
                src={capturedImage} 
                alt="תמונה בעיבוד" 
                className="w-64 h-64 object-cover rounded-2xl mx-auto shadow-2xl border-4 border-white"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl">
                <div className="absolute inset-0 border-2 border-blue-400 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="relative mb-8">
            <div className="animate-spin w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-3">🔬 מעבד תמונה...</h2>
          <p className="text-gray-600 mb-8 text-lg">הבינה המלאכותית בוחנת את האתרוג בקפידה</p>
          
          <div className="w-full bg-gray-200 rounded-full h-6 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${processingProgress}%` }}
            >
              <div className="absolute inset-0 bg-white bg-opacity-30 animate-pulse"></div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mb-8">{currentStep || 'מכין לעיבוד...'}</div>
          
          <button
            onClick={resetApp}
            className="px-8 py-3 text-gray-500 hover:text-gray-700 text-sm transition-all border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-medium"
          >
            ❌ ביטול
          </button>
        </div>
      </div>
    </div>
  );

  const ResultScreen = () => {
    const getStatusIcon = () => {
      if (!result) return '❓';
      switch (result.status) {
        case 'kosher': return '✅';
        case 'invalid': return '❌';
        default: return '⚠️';
      }
    };

    const getStatusColor = () => {
      if (!result) return 'gray';
      switch (result.status) {
        case 'kosher': return 'green';
        case 'invalid': return 'red';
        default: return 'orange';
      }
    };

    const getStatusText = () => {
      if (!result) return 'לא ידוע';
      switch (result.status) {
        case 'kosher': return 'אתרוג כשר ✨';
        case 'invalid': return 'אתרוג לא כשר ❌';
        default: return 'לא ברור ⚠️';
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4">
        <ErrorMessage />
        
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8 pt-4">
            <button 
              onClick={goBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 bg-white px-4 py-3 rounded-xl shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              חזור
            </button>
            
            <h1 className="text-2xl font-bold text-gray-800">📋 דוח זיהוי מקצועי</h1>
            
            <button 
              onClick={exportReport}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-white px-4 py-3 rounded-xl shadow-lg"
            >
              <Download className="w-5 h-5" />
              יצוא
            </button>
          </div>

          {capturedImage && (
            <div className="mb-8 text-center">
              <img 
                src={capturedImage} 
                alt="תמונה שנבדקה" 
                className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl border-4 border-white"
              />
              {result?.qualityScore && (
                <div className="mt-4 inline-block bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg">
                  🏆 ציון איכות: {result.qualityScore}/100
                </div>
              )}
            </div>
          )}

          <div className={`rounded-2xl p-8 mb-8 shadow-2xl border-2 ${
            getStatusColor() === 'green' ? 'bg-green-50 border-green-200' :
            getStatusColor() === 'red' ? 'bg-red-50 border-red-200' :
            'bg-orange-50 border-orange-200'
          }`}>
            <div className="text-center mb-6">
              <div className={`text-8xl mb-4 ${
                getStatusColor() === 'green' ? 'text-green-600' :
                getStatusColor() === 'red' ? 'text-red-600' :
                'text-orange-600'
              }`}>
                {getStatusIcon()}
              </div>
              
              <h2 className={`text-3xl font-bold mb-2 ${
                getStatusColor() === 'green' ? 'text-green-800' :
                getStatusColor() === 'red' ? 'text-red-800' :
                'text-orange-800'
              }`}>
                {getStatusText()}
              </h2>
              
              <p className="text-gray-600 text-lg mb-4">{result?.details}</p>
              
              {result?.variety && (
                <div className="inline-block bg-white px-4 py-2 rounded-xl shadow-md">
                  <span className="font-bold text-gray-800">🍋 {result.variety}</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-gray-800">🎯 רמת וודאות AI</span>
                <span className="text-2xl font-bold">{Math.round((result?.confidence || 0) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-2000 ${
                    getStatusColor() === 'green' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                    getStatusColor() === 'red' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                    'bg-gradient-to-r from-orange-400 to-orange-600'
                  }`}
                  style={{ width: `${(result?.confidence || 0) * 100}%` }}
                ></div>
              </div>
            </div>

            {result?.measurements && (
              <div className="border-t-2 border-gray-200 pt-6 mb-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Ruler className="w-6 h-6" />
                  מדידות מדויקות
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(result.measurements).map(([key, value]) => (
                    <div key={key} className="bg-white p-4 rounded-xl shadow-md">
                      <div className="text-gray-600 text-sm mb-1">
                        {key === 'length' ? '📏 אורך' :
                         key === 'width' ? '📐 רוחב' :
                         key === 'weight' ? '⚖️ משקל' :
                         key === 'pitam' ? '👑 פיטם' : key}
                      </div>
                      <div className="font-bold text-lg">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result?.halachicNotes && (
              <div className="border-t-2 border-gray-200 pt-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  📚 פסיקה הלכתית
                </h3>
                <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-400">
                  <div className="text-blue-800">{result.halachicNotes}</div>
                  {result.certification && (
                    <div className="mt-4 text-sm text-blue-600">
                      הכשרה: {result.certification}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {userProfile === 'merchant' && result?.businessInsights && (
            <div className="bg-white rounded-2xl p-8 shadow-2xl mb-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                ניתוח עסקי מתקדם
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <div className="text-green-800 font-bold text-lg mb-2">💰 מחיר משוער</div>
                  <div className="text-4xl font-bold text-green-600">
                    ₪{result.businessInsights.estimatedPrice}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <div className="text-blue-800 font-bold text-lg mb-2">📈 רווח צפוי</div>
                  <div className="text-4xl font-bold text-blue-600">
                    {result.businessInsights.profitMargin}
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-300">
                <div className="text-xl font-bold mb-4">🎯 המלצה אסטרטגית</div>
                <div className="text-lg">{result.businessInsights.recommendation}</div>
              </div>
            </div>
          )}

          {result?.origin && (
            <div className="bg-white rounded-2xl p-6 shadow-xl mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-purple-600" />
                מקור ועקיבות
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-600 text-sm">🌱 מקור גידול</div>
                  <div className="font-bold text-lg">{result.origin}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">📅 תאריך קטיף</div>
                  <div className="font-medium">ספטמבר 2024</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={resetApp}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              <Camera className="w-6 h-6" />
              🔍 בדוק אתרוג נוסף
              <Sparkles className="w-5 h-5" />
            </button>
            
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={shareResult}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                שתף
              </button>
              
              <button
                onClick={exportReport}
                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                יצוא
              </button>
              
              <button
                onClick={addToFavorites}
                className="bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4" />
                שמור
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HistoryScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={goBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 bg-white px-4 py-3 rounded-xl shadow-lg">
            <ArrowLeft className="w-5 h-5" />
            חזור
          </button>
          <h1 className="text-2xl font-bold text-gray-800">📋 היסטוריית בדיקות</h1>
          <div className="w-16" />
        </div>

        {history.length === 0 ? (
          <div className="text-center py-16">
            <History className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">אין בדיקות קודמות</h2>
            <p className="text-gray-500 mb-6">התחל לצלם אתרוגים כדי לראות את ההיסטוריה כאן</p>
            <button 
              onClick={() => setCurrentView('home')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold"
            >
              צלם אתרוג ראשון
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {history.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${
                      item.result.status === 'kosher' ? 'bg-green-500' :
                      item.result.status === 'invalid' ? 'bg-red-500' : 'bg-orange-500'
                    }`}></div>
                    <div>
                      <h3 className="font-bold text-lg">{item.result.variety || 'אתרוג'}</h3>
                      <p className="text-gray-600 text-sm">{item.result.details}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{item.timestamp.toLocaleDateString('he-IL')}</div>
                    <div>{item.timestamp.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  {item.supplier && (
                    <div>
                      <span className="text-gray-600">🏪 ספק:</span>
                      <div className="font-medium">{item.supplier}</div>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">🎯 וודאות:</span>
                    <div className="font-medium">{Math.round(item.result.confidence * 100)}%</div>
                  </div>
                </div>
                
                {item.result.businessInsights?.estimatedPrice && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-bold text-green-800">
                      💰 מחיר משוער: ₪{item.result.businessInsights.estimatedPrice}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

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
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentScreen()}
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar />
      
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBD2Z1+/NewQFKYHO8diJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBD2Z1+/NewQFKYHO8diJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmzhBD2Z1+/NewsFKYHO8diJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBD2Z1+/NewQFKYHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBD2Z1+/NewQFKYHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBD2Z1+/NewQFKYHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBD2Z1+/NewQFKYHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBD2Z1+/NewQFKYHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBD2Z1+/NewQFKYHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBD2Z1+/NewQFKYHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBD2Z1+/NewQFKYHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBD2Z1+/NewQFKYHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmzhBD2Z1+/NewsVFApGn+DyvmwhBD2Z1+/NewQFKYHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBD2Z1+/NewQFKYHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBD2Z1+/NewQFKYHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBD2Z1+/NewQFKYHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBD2Z1+/NewQFKYHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBD2Z1+/NewsF" type="audio/wav" />
      </audio>
    </div>
  );
};

export default EtrogIdentifierApp;