import React, { useRef } from 'react';
import {
  Camera,
  Upload,
  Check,
  Star,
  DollarSign,
  TrendingUp,
  Database,
  Menu,
  Bell,
  Info
} from 'lucide-react';
import { useAppStore } from '@/contexts/AppStore';
import { marketPrices, APP_CONSTANTS } from '@/data/etrogData';
import toast from 'react-hot-toast';

const HomeScreen: React.FC = () => {
  const {
    userProfile,
    analytics,
    notifications,
    currentSupplier,
    setCurrentSupplier,
    currentLocation,
    setCurrentLocation,
    batchMode,
    setBatchMode,
    aiMode,
    setAiMode,
    imageQuality,
    setImageQuality,
    showAdvancedSettings,
    setShowAdvancedSettings,
    darkMode,
    setSidebarOpen,
    startCamera,
    isProcessing
  } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type || !file.type.startsWith('image/')) {
      toast.error('אנא בחר קובץ תמונה בלבד');
      return;
    }

    if (!APP_CONSTANTS.SUPPORTED_FORMATS.includes(file.type)) {
      toast.error('פורמט תמונה לא נתמך');
      return;
    }

    if (file.size > APP_CONSTANTS.MAX_FILE_SIZE) {
      toast.error('גודל התמונה גדול מדי. מקסימום 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      useAppStore.getState().setCapturedImage(imageData);
      useAppStore.getState().setCurrentView('processing');
      useAppStore.getState().simulateAIClassification(imageData).then(result => {
        useAppStore.getState().setResult(result);
        useAppStore.getState().setCurrentView('result');
      });
    };
    reader.readAsDataURL(file);

    event.target.value = '';
  };

  const handleStartCamera = async () => {
    try {
      await startCamera();
    } catch (error) {
      toast.error('שגיאה בהפעלת המצלמה');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'gradient-primary'} p-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        <div className="text-center">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            זיהוי אתרוגים AI
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            מערכת מקצועית לסוחרים
          </p>
        </div>

        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors relative"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {notifications && notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>
      </div>

      <div className="container-responsive">
        {/* Quick stats for merchants */}
        {userProfile === 'merchant' && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.totalScanned}</div>
              <div className="text-xs text-gray-600">נסרקו היום</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(analytics.kosherRate * 100)}%
              </div>
              <div className="text-xs text-gray-600">אחוז כשרות</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-orange-600">
                ₪{marketPrices.current.rishon.avg}
              </div>
              <div className="text-xs text-gray-600">ממוצע ראשונים</div>
            </div>
          </div>
        )}

        {/* Main features */}
        <div className="card mb-6">
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
            <div className="flex items-center gap-3">
              <TrendingUp className="text-blue-500 w-5 h-5 flex-shrink-0" />
              <span>ניתוח רווחיות ומגמות שוק</span>
            </div>
            <div className="flex items-center gap-3">
              <Database className="text-purple-500 w-5 h-5 flex-shrink-0" />
              <span>ניהול מלאי ומעקב אחר משלוחים</span>
            </div>
          </div>
        </div>

        {/* Business context inputs */}
        {userProfile === 'merchant' && (
          <div className="card mb-6">
            <h3 className="font-semibold mb-3">הקשר עסקי</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ספק נוכחי</label>
                <input
                  type="text"
                  value={currentSupplier}
                  onChange={(e) => setCurrentSupplier(e.target.value)}
                  placeholder="שם הספק"
                  className="input-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מיקום</label>
                <select
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value as any)}
                  className="input-primary"
                >
                  <option value="jerusalem">ירושלים</option>
                  <option value="bnei_brak">בני ברק</option>
                  <option value="modiin_illit">מודיעין עילית</option>
                  <option value="netanya">נתניה</option>
                  <option value="haifa">חיפה</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={batchMode}
                  onChange={(e) => setBatchMode(e.target.checked)}
                  id="batchMode"
                />
                <label htmlFor="batchMode" className="text-sm">מצב עיבוד קבוצתי</label>
              </div>
            </div>
          </div>
        )}

        {/* Advanced settings */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">הגדרות זיהוי</h3>
            <button
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="text-blue-600 text-sm"
            >
              {showAdvancedSettings ? 'פחות' : 'עוד'}
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">מצב AI</label>
              <select
                value={aiMode}
                onChange={(e) => setAiMode(e.target.value as any)}
                className="input-primary"
              >
                <option value="basic">בסיסי - מהיר (10 שניות)</option>
                <option value="standard">רגיל - מדויק (20 שניות)</option>
                <option value="comprehensive">מקיף - מקצועי (45 שניות)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">איכות תמונה</label>
              <select
                value={imageQuality}
                onChange={(e) => setImageQuality(e.target.value as any)}
                className="input-primary"
              >
                <option value="high">גבוהה - דיוק מקסימלי</option>
                <option value="medium">בינונית - מהיר יותר</option>
              </select>
            </div>

            {showAdvancedSettings && (
              <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
                <strong>מצב מקיף כולל:</strong> ניתוח ספקטרלי, זיהוי מיקרו-פגמים,
                בדיקת יחסי מידה, ניתוח מרקם מתקדם, הערכת מחיר דינמית
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <button
            onClick={handleStartCamera}
            disabled={isProcessing}
            className="btn-primary w-full flex items-center justify-center gap-3"
          >
            <Camera className="w-6 h-6" />
            {batchMode ? 'צילום קבוצתי' : 'צלם אתרוג חדש'}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <Upload className="w-6 h-6" />
            {batchMode ? 'העלאה קבוצתית' : 'העלה תמונה'}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={batchMode}
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Market insights for merchants */}
        {userProfile === 'merchant' && (
          <div className="mt-6 card">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              מגמות שוק עדכניות
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>ראשונים:</span>
                <span className="text-green-600 font-medium">
                  ₪{marketPrices.current.rishon.avg} ({marketPrices.current.rishon.trend})
                </span>
              </div>
              <div className="flex justify-between">
                <span>שניים:</span>
                <span className="text-blue-600 font-medium">
                  ₪{marketPrices.current.sheni.avg} ({marketPrices.current.sheni.trend})
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                עדכון אחרון: היום 08:30
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-start gap-2">
            <Info className="text-blue-500 w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-semibold mb-1">
                {userProfile === 'merchant' ? 'טיפים לסוחרים:' : 'טיפים לצילום:'}
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                {userProfile === 'merchant' ? (
                  <>
                    <li>השתמש במצב מקיף לדיוק מקסימלי בבדיקות</li>
                    <li>רשום פרטי ספק ומיקום לניהול מלאי טוב</li>
                    <li>השתמש במצב קבוצתי לעיבוד משלוחים גדולים</li>
                    <li>עקב אחר מגמות מחירים לקניות חכמות</li>
                  </>
                ) : (
                  <>
                    <li>צלם באור טבעי או תאורה טובה</li>
                    <li>הצב את האתרוג במרכז המסגרת</li>
                    <li>ודא שהאתרוג נראה בבירור מכל הצדדים</li>
                    <li>הימנע מצללים חזקים על האתרוג</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen; 