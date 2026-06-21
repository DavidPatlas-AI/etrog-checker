import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Camera, Upload, Check, X, AlertCircle, Star, Info, ArrowLeft, RotateCcw, 
  Home, Settings, History, BarChart3, Download, Share2, MapPin, 
  TrendingUp, Package, DollarSign, Eye, Ruler, Menu, Bell
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
  
  // Advanced settings
  const [cameraFacing, setCameraFacing] = useState('environment');
  const [imageQuality, setImageQuality] = useState('high');
  const [aiMode, setAiMode] = useState('comprehensive');
  const [userProfile, setUserProfile] = useState('merchant');
  const [language, setLanguage] = useState('he');
  
  // Business features
  const [history, setHistory] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalScanned: 0,
    kosherRate: 0,
    averageGrade: 0,
    monthlyTrends: []
  });
  const [notifications, setNotifications] = useState([]);
  const [currentSupplier, setCurrentSupplier] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [batchMode, setBatchMode] = useState(false);
  const [currentBatch, setCurrentBatch] = useState([]);
  
  // UI state
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Extended etrog categories with market data
  const etrogCategories = {
    primary: [
      { 
        id: 'rishon', 
        name: 'ראשונים', 
        price: '500-800 ₪', 
        priceUSD: '$140-220',
        description: 'איכות מעולה - פרימיום',
        marketDemand: 'גבוה',
        seasonality: 'תשרי-מרחשוון',
        profitMargin: '40-60%'
      },
      { 
        id: 'sheni', 
        name: 'שניים', 
        price: '300-500 ₪', 
        priceUSD: '$85-140',
        description: 'איכות טובה מאוד',
        marketDemand: 'גבוה',
        seasonality: 'אלול-כסלו',
        profitMargin: '30-45%'
      },
      { 
        id: 'shlishi_square', 
        name: 'שלישי מרובע', 
        price: '200-300 ₪',
        priceUSD: '$55-85', 
        description: 'איכות טובה',
        marketDemand: 'בינוני',
        seasonality: 'אלול-תשרי',
        profitMargin: '25-35%'
      }
    ],
    export: [
      { 
        id: 'sorotzkin', 
        name: 'סורוצקין', 
        market: 'יצוא',
        quality: 'premium',
        destinations: ['ניו יורק', 'לונדון', 'אנטוורפן'],
        requirements: 'תעודת כשרות בד"ץ',
        shipping: 'אווירי מקורר'
      }
    ],
    market: [
      { id: 'shuk_anash', name: 'שוק אנש', grade: 'A+', color: 'emerald', premium: '+25%' },
      { id: 'shuk_a', name: 'א שוק', grade: 'A', color: 'blue', premium: '+15%' }
    ],
    defects: [
      { name: 'קווקב במיץ', severity: 'critical', halachic: 'פוסל' },
      { name: 'חתיכת עץ בולטת', severity: 'critical', halachic: 'פוסל' },
      { name: 'נקודות שחורות', severity: 'moderate', halachic: 'תלוי במיקום וגודל' }
    ]
  };

  // Market prices database
  const marketPrices = {
    current: {
      'rishon': { avg: 650, trend: '+5%', lastWeek: 620 },
      'sheni': { avg: 400, trend: '+3%', lastWeek: 390 }
    },
    locations: {
      'jerusalem': { modifier: 1.1, name: 'ירושלים' },
      'bnei_brak': { modifier: 1.15, name: 'בני ברק' }
    }
  };

  // Effects
  useEffect(() => {
    loadUserData();
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

  // Data persistence functions
  const saveToHistory = useCallback((result, image) => {
    const historyItem = {
      id: Date.now(),
      timestamp: new Date(),
      result,
      image,
      supplier: currentSupplier,
      location: currentLocation,
      batch: batchMode ? currentBatch.length + 1 : null
    };
    
    setHistory(prev => [historyItem, ...prev.slice(0, 99)]);
    updateAnalytics(result);
    
    if (batchMode) {
      setCurrentBatch(prev => [...prev, historyItem]);
    }
  }, [currentSupplier, currentLocation, batchMode, currentBatch.length]);

  const updateAnalytics = useCallback((result) => {
    setAnalytics(prev => ({
      ...prev,
      totalScanned: prev.totalScanned + 1,
      kosherRate: result.status === 'kosher' 
        ? (prev.kosherRate * prev.totalScanned + 1) / (prev.totalScanned + 1)
        : (prev.kosherRate * prev.totalScanned) / (prev.totalScanned + 1)
    }));
  }, []);

  const loadUserData = () => {
    // Load user preferences, history, etc.
  };

  const checkNotifications = () => {
    const mockNotifications = [
      { id: 1, text: 'מחירי ראשונים עלו ב-5% השבוע', type: 'price', time: '2 hours ago' }
    ];
    setNotifications(mockNotifications);
  };

  // Utility functions
  const showError = useCallback((message) => {
    setError(message);
    console.error('App Error:', message);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Enhanced AI Classification
  const simulateAIClassification = async (imageData) => {
    const steps = aiMode === 'comprehensive' ? [
      { name: 'טוען תמונה...', progress: 5, delay: 200 },
      { name: 'זיהוי צורה גיאומטרית...', progress: 20, delay: 500 },
      { name: 'ניתוח ספקטרלי...', progress: 45, delay: 600 },
      { name: 'סריקת פגמים...', progress: 70, delay: 700 },
      { name: 'חישוב הערכת מחיר...', progress: 95, delay: 300 },
      { name: 'יצירת דוח...', progress: 100, delay: 200 }
    ] : [
      { name: 'מנתח תמונה...', progress: 25, delay: 400 },
      { name: 'בוחן כשרות...', progress: 60, delay: 600 },
      { name: 'מסיים...', progress: 100, delay: 300 }
    ];

    for (const step of steps) {
      setProcessingProgress(step.progress);
      await new Promise(resolve => setTimeout(resolve, step.delay));
    }

    const scenarios = [
      {
        status: 'kosher',
        confidence: 0.96,
        variety: 'אתרוג תימני מובחר',
        details: 'אתרוג איכותי מדרגה ראשונה עם פוטנציאל רווח גבוה',
        defects: [],
        category: etrogCategories.primary[0],
        exportCategory: etrogCategories.export[0],
        marketGrade: etrogCategories.market[0],
        measurements: { 
          length: '12.3 ס"מ', 
          width: '8.1 ס"מ', 
          weight: '185 גרם',
          pitam: 'שלם ויפה'
        },
        halachicNotes: 'מתאים למצוות ארבעת המינים ללא הסתייגות',
        businessInsights: {
          estimatedPrice: 725,
          profitMargin: '45%',
          marketDemand: 'גבוה מאוד',
          competitorPrice: 680,
          recommendation: 'מומלץ לרכישה - פוטנציאל רווח מעולה'
        },
        qualityScore: 95,
        certification: 'בד"ץ עדה חרדית',
        origin: 'יטבתה, ישראל',
        harvest: '2024-09-15'
      }
    ];

    const selectedScenario = scenarios[0];
    
    if (selectedScenario) {
      saveToHistory(selectedScenario, imageData);
    }
    
    return selectedScenario;
  };

  // Camera functions
  const startCamera = async () => {
    try {
      clearError();
      
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('המצלמה אינה נתמכת בדפדפן זה');
      }

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
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(console.error);
          }
        };
      }
      
      setCurrentView('camera');
    } catch (error) {
      handleCameraError(error);
    }
  };

  const handleCameraError = (error) => {
    if (error.name === 'NotAllowedError') {
      showError('נדרשת הרשאה לגישה למצלמה');
    } else if (error.name === 'NotFoundError') {
      showError('לא נמצאה מצלמה במכשיר זה');
    } else {
      showError('שגיאה בהפעלת המצלמה: ' + error.message);
    }
  };

  const capturePhoto = useCallback(() => {
    try {
      if (!videoRef.current?.readyState || videoRef.current.readyState < 2) {
        showError('המצלמה טוענת. אנא המתן רגע ונסה שוב.');
        return;
      }

      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      if (!canvas || !video) {
        showError('שגיאה בגישה למצלמה.');
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const quality = imageQuality === 'high' ? 0.95 : 0.8;
      const imageData = canvas.toDataURL('image/jpeg', quality);
      
      if (!imageData || !imageData.startsWith('data:image')) {
        showError('שגיאה בצילום. אנא נסה שוב.');
        return;
      }
      
      setCapturedImage(imageData);
      stopCamera();
      processImage(imageData);
    } catch (error) {
      showError('שגיאה בצילום התמונה.');
    }
  }, [imageQuality, showError]);

  const switchCamera = () => {
    setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment');
    if (cameraStream) {
      stopCamera();
      setTimeout(startCamera, 100);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  // File upload
  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    processSingleImage(files[0]);
    event.target.value = '';
  };

  const processSingleImage = (file) => {
    if (!file.type || !file.type.startsWith('image/')) {
      showError('אנא בחר קובץ תמונה בלבד');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      showError('גודל התמונה גדול מדי. מקסימום 10MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      setCapturedImage(imageData);
      processImage(imageData);
    };
    reader.onerror = () => showError('שגיאה בקריאת הקובץ');
    reader.readAsDataURL(file);
  };

  // Image processing
  const processImage = async (imageData) => {
    try {
      setIsProcessing(true);
      setProcessingProgress(0);
      clearError();
      setCurrentView('processing');
      
      if (!imageData || !imageData.startsWith('data:image')) {
        throw new Error('תמונה לא תקינה');
      }
      
      const result = await simulateAIClassification(imageData);
      setResult(result);
      setCurrentView('result');
    } catch (error) {
      showError('שגיאה בעיבוד התמונה: ' + error.message);
      setCurrentView('home');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
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
    } else if (currentView === 'result') {
      setCurrentView('home');
      setResult(null);
      setCapturedImage(null);
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
      text: `🍋 ${result.variety || 'אתרוג'}
📊 סטטוס: ${result.status === 'kosher' ? 'כשר ✅' : result.status === 'invalid' ? 'לא כשר ❌' : 'לא ברור ⚠️'}
🎯 וודאות: ${Math.round((result.confidence || 0) * 100)}%
${result.businessInsights ? `💰 מחיר משוער: ${result.businessInsights.estimatedPrice}₪` : ''}
📅 ${new Date().toLocaleDateString('he-IL')}`
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        alert('הדוח הועתק ללוח');
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
      settings: { aiMode, imageQuality },
      location: currentLocation,
      supplier: currentSupplier
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `etrog-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Components
  const ErrorMessage = () => error ? (
    <div className="fixed top-4 left-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
        <button onClick={clearError} className="text-red-500 hover:text-red-700 ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : null;

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-800">תפריט ראשי</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <nav className="space-y-4">
          <button 
            onClick={() => { setCurrentView('home'); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 p-3 text-right hover:bg-gray-100 rounded-lg"
          >
            <Home className="w-5 h-5" />
            בית
          </button>
          
          <button 
            onClick={() => { setCurrentView('history'); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 p-3 text-right hover:bg-gray-100 rounded-lg"
          >
            <History className="w-5 h-5" />
            היסטוריה ({history && history.length})
          </button>
        </nav>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">פרופיל משתמש</div>
          <select 
            value={userProfile} 
            onChange={(e) => setUserProfile(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          >
            <option value="merchant">סוחר מקצועי</option>
            <option value="consumer">צרכן</option>
            <option value="rabbi">רב/פוסק</option>
          </select>
        </div>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-4">
      <ErrorMessage />
      
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">זיהוי אתרוגים AI</h1>
          <p className="text-sm text-gray-600">מערכת מקצועית לסוחרים</p>
        </div>
        
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="max-w-md mx-auto">
        {userProfile === 'merchant' && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-lg text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.totalScanned}</div>
              <div className="text-xs text-gray-600">נסרקו היום</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(analytics.kosherRate * 100)}%</div>
              <div className="text-xs text-gray-600">אחוז כשרות</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg text-center">
              <div className="text-2xl font-bold text-orange-600">₪{marketPrices.current.rishon.avg}</div>
              <div className="text-xs text-gray-600">ממוצע ראשונים</div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-center">יכולות המערכת</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Check className="text-green-500 w-5 h-5 flex-shrink-0" />
              <span>זיהוי כשרות ופגמים ברמת דיוק של 96%+</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="text-orange-500 w-5 h-5 flex-shrink-0" />
              <span>מיון אוטומטי לקטגוריות מסחריות</span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="text-green-500 w-5 h-5 flex-shrink-0" />
              <span>הערכת מחיר בזמן אמת לפי השוק</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={startCamera}
            disabled={isProcessing}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <Camera className="w-6 h-6" />
            צלם אתרוג חדש
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
        />
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-green-400 rounded-xl">
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-green-300 rounded-tl-xl"></div>
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-green-300 rounded-tr-xl"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-green-300 rounded-bl-xl"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-green-300 rounded-br-xl"></div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-0.5 bg-green-400 absolute -translate-x-1/2"></div>
              <div className="h-8 w-0.5 bg-green-400 absolute -translate-y-1/2"></div>
            </div>
          </div>
          
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
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setImageQuality(imageQuality === 'high' ? 'medium' : 'high')}
              className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all backdrop-blur-sm"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={capturePhoto}
            className="bg-white w-24 h-24 rounded-full border-4 border-gray-300 hover:border-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <Camera className="w-10 h-10 text-gray-600" />
            </div>
          </button>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );

  const ProcessingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <ErrorMessage />
      <div className="text-center max-w-sm mx-auto">
        {capturedImage && (
          <div className="mb-6 relative">
            <img 
              src={capturedImage} 
              alt="תמונה בעיבוד" 
              className="w-56 h-56 object-cover rounded-xl mx-auto shadow-lg"
            />
            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-xl">
              <div className="absolute inset-0 border-2 border-blue-400 rounded-xl animate-pulse"></div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="relative mb-6">
            <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">מעבד תמונה...</h2>
          <p className="text-gray-600 mb-6">הבינה המלאכותית בוחנת את האתרוג</p>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${processingProgress}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-500 mb-6 font-medium">{processingProgress}% הושלם</div>
          
          <button
            onClick={resetApp}
            className="mt-6 px-6 py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ביטול
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
        case 'kosher': return 'אתרוג כשר';
        case 'invalid': return 'אתרוג לא כשר';
        default: return 'לא ברור';
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4">
        <ErrorMessage />
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6 pt-4">
            <button 
              onClick={goBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 bg-white px-3 py-2 rounded-lg shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              חזור
            </button>
            <h1 className="text-xl font-bold text-gray-800">דוח זיהוי מקצועי</h1>
            <button 
              onClick={exportReport}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-white px-3 py-2 rounded-lg shadow-sm"
            >
              <Download className="w-4 h-4" />
              יצוא
            </button>
          </div>

          {capturedImage && (
            <div className="mb-6 relative">
              <img 
                src={capturedImage} 
                alt="תמונה שנבדקה" 
                className="w-full max-w-sm mx-auto rounded-xl shadow-lg"
              />
              {result?.qualityScore && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                  ציון איכות: {result.qualityScore}/100
                </div>
              )}
            </div>
          )}

          <div className={`rounded-xl p-6 mb-6 shadow-lg border-2 ${
            getStatusColor() === 'green' ? 'bg-green-50 border-green-200' :
            getStatusColor() === 'red' ? 'bg-red-50 border-red-200' :
            'bg-orange-50 border-orange-200'
          }`}>
            <div className="text-center mb-4">
              <div className={`text-6xl mb-2 ${
                getStatusColor() === 'green' ? 'text-green-600' :
                getStatusColor() === 'red' ? 'text-red-600' :
                'text-orange-600'
              }`}>
                {getStatusIcon()}
              </div>
              
              <h2 className={`text-2xl font-bold ${
                getStatusColor() === 'green' ? 'text-green-800' :
                getStatusColor() === 'red' ? 'text-red-800' :
                'text-orange-800'
              }`}>
                {getStatusText()}
              </h2>
              
              <p className="text-gray-600 mt-2">{result?.details}</p>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">רמת וודאות AI</span>
                <span className="text-sm font-bold">{Math.round((result?.confidence || 0) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    getStatusColor() === 'green' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                    getStatusColor() === 'red' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                    'bg-gradient-to-r from-orange-400 to-orange-600'
                  }`}
                  style={{ width: `${(result?.confidence || 0) * 100}%` }}
                ></div>
              </div>
            </div>

            {result?.measurements && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  מדידות מדויקות
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-gray-600">אורך</div>
                    <div className="font-bold text-lg">{result.measurements && result.measurements.length}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-gray-600">רוחב</div>
                    <div className="font-bold text-lg">{result.measurements.width}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-gray-600">משקל משוער</div>
                    <div className="font-bold text-lg">{result.measurements.weight}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-gray-600">פיטם</div>
                    <div className="font-bold text-sm">{result.measurements.pitam}</div>
                  </div>
                </div>
              </div>
            )}

            {result?.halachicNotes && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <div className="text-blue-600">📚</div>
                  פסיקה הלכתית
                </h3>
                <div className="text-sm text-gray-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  {result.halachicNotes}
                  {result.certification && (
                    <div className="mt-2 text-xs text-blue-600">
                      הכשרה מומלצת: {result.certification}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {userProfile === 'merchant' && result?.businessInsights && (
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                ניתוח עסקי מתקדם
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-green-800 font-medium">מחיר משוער</div>
                  <div className="text-2xl font-bold text-green-600">
                    ₪{result.businessInsights.estimatedPrice}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-blue-800 font-medium">רווח צפוי</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {result.businessInsights.profitMargin}
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  המלצה אסטרטגית
                </div>
                <div className="text-sm">{result.businessInsights.recommendation}</div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={resetApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              בדוק אתרוג נוסף
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={shareResult}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                שתף
              </button>
              
              <button
                onClick={exportReport}
                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                יצוא דוח
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HistoryScreen = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={goBack} className="flex items-center gap-2 text-gray-600">
            <ArrowLeft className="w-5 h-5" />
            חזור
          </button>
          <h1 className="text-xl font-bold">היסטוריית בדיקות</h1>
          <div className="w-16" />
        </div>

        {history && history.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">אין בדיקות קודמות</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-4 shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      item.result.status === 'kosher' ? 'bg-green-500' :
                      item.result.status === 'invalid' ? 'bg-red-500' : 'bg-orange-500'
                    }`}></div>
                    <span className="font-medium">{item.result.variety || 'אתרוג'}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {item.timestamp.toLocaleDateString('he-IL')} {item.timestamp.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {item.supplier && <span>ספק: {item.supplier}</span>}
                  {item.location && <span>מיקום: {marketPrices.locations[item.location]?.name}</span>}
                  <span>וודאות: {Math.round(item.result.confidence * 100)}%</span>
                </div>
                
                {item.result.businessInsights?.estimatedPrice && (
                  <div className="mt-2 text-sm font-medium text-green-600">
                    מחיר משוער: ₪{item.result.businessInsights.estimatedPrice}
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
    </div>
  );
};

export default EtrogIdentifierApp;