import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  Star,
  Info,
  Camera,
  History
} from 'lucide-react';
import { useAppStore } from '@/contexts/AppStore';

const ResultScreen: React.FC = () => {
  const {
    result,
    capturedImage,
    setCurrentView,
    userProfile
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'summary' | 'details' | 'business'>('summary');

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">לא נמצאו תוצאות</h2>
          <p className="text-gray-600 mb-4">אירעה שגיאה בעיבוד התמונה</p>
          <button
            onClick={() => setCurrentView('home')}
            className="btn-primary"
          >
            חזור למסך הראשי
          </button>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (result.status) {
      case 'kosher':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'invalid':
        return <XCircle className="w-8 h-8 text-red-500" />;
      case 'uncertain':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      default:
        return <Info className="w-8 h-8 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case 'kosher':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'invalid':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'uncertain':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getStatusText = () => {
    switch (result.status) {
      case 'kosher':
        return 'אתרוג כשר';
      case 'invalid':
        return 'אתרוג לא כשר';
      case 'uncertain':
        return 'לא ברור - יש להתייעץ עם רב';
      default:
        return 'לא ידוע';
    }
  };

  const renderAnalyzers = () => {
    if (!result.analyzerOutputs || result.analyzerOutputs.length === 0) return null;
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">פירוט מפענחים</h3>
        <div className="space-y-2">
          {result.analyzerOutputs.map((a, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm border-b pb-2 last:border-b-0 last:pb-0">
              <div className="font-medium text-gray-700">{a.name}</div>
              <div className="text-gray-600">
                סטטוס: {a.status === 'kosher' ? 'כשר' : a.status === 'invalid' ? 'לא כשר' : 'לא ברור'} · דיוק: {Math.round(a.confidence * 100)}%
                {a.notes ? ` · ${a.notes}` : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'תוצאת זיהוי אתרוג',
          text: `אתרוג ${result.status === 'kosher' ? 'כשר' : 'לא כשר'} - דיוק AI: ${Math.round(result.confidence * 100)}%`,
          url: window.location.href
        });
      } catch (error) {
        console.log('שגיאה בשיתוף');
      }
    } else {
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(`אתרוג ${result.status === 'kosher' ? 'כשר' : 'לא כשר'} - דיוק AI: ${Math.round(result.confidence * 100)}%`);
      } catch (e) {
        console.warn('Clipboard unavailable');
      }
    }
  };

  const handleDownload = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = `etrog-${Date.now()}.jpg`;
      link.click();
    }
  };

  const handleNewScan = () => {
    setCurrentView('home');
  };

  const handleViewHistory = () => {
    setCurrentView('history');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              חזור
            </button>

            <h1 className="text-xl font-bold text-gray-800">תוצאות זיהוי</h1>

            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                title="שתף תוצאות"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                title="הורד תמונה"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-responsive py-6">
        {/* Status Card */}
        <div className={`card border-2 ${getStatusColor()} mb-6`}>
          <div className="flex items-center gap-4">
            {getStatusIcon()}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{getStatusText()}</h2>
              <p className="text-sm opacity-80">
                דיוק AI: {Math.round(result.confidence * 100)}% •
                {result.variety && ` זן: ${result.variety}`}
              </p>
            </div>
          </div>
        </div>

        {/* Analyzer details */}
        {renderAnalyzers()}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'summary'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            סיכום
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'details'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            פרטים
          </button>
          {userProfile === 'merchant' && (
            <button
              onClick={() => setActiveTab('business')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'business'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              עסקי
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Image */}
              {capturedImage && (
                <div className="card">
                  <h3 className="font-semibold mb-3">תמונה שנסרקה</h3>
                  <img
                    src={capturedImage}
                    alt="אתרוג שנסרק"
                    className="w-full rounded-lg max-h-64 object-cover"
                  />
                </div>
              )}

              {/* Basic Info */}
              <div className="card">
                <h3 className="font-semibold mb-3">מידע בסיסי</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">סטטוס:</span>
                    <span className={`font-medium ${result.status === 'kosher' ? 'text-green-600' : 'text-red-600'}`}>
                      {getStatusText()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">דיוק AI:</span>
                    <span className="font-medium">{Math.round(result.confidence * 100)}%</span>
                  </div>
                  {result.variety && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">זן:</span>
                      <span className="font-medium">{result.variety}</span>
                    </div>
                  )}
                  {result.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">קטגוריה:</span>
                      <span className="font-medium">{result.category.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Defects */}
              {result.defects && result.defects.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold mb-3 text-red-600">פגמים שזוהו</h3>
                  <ul className="space-y-2">
                    {result.defects.map((defect, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{defect}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Halachic Notes */}
              {result.halachicNotes && (
                <div className="card">
                  <h3 className="font-semibold mb-3">הערות הלכתיות</h3>
                  <p className="text-sm text-gray-700">{result.halachicNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Measurements */}
              {result.measurements && (
                <div className="card">
                  <h3 className="font-semibold mb-3">מדידות מדויקות</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">אורך:</span>
                      <div className="font-medium">{result.measurements && result.measurements.length}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">רוחב:</span>
                      <div className="font-medium">{result.measurements.width}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">משקל:</span>
                      <div className="font-medium">{result.measurements.weight}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">פיטם:</span>
                      <div className="font-medium">{result.measurements.pitam}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quality Score */}
              {result.qualityScore !== undefined && (
                <div className="card">
                  <h3 className="font-semibold mb-3">ציון איכות</h3>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold text-blue-600">{result.qualityScore}</div>
                    <div className="flex-1">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(result.qualityScore! / 20)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        מתוך 100 נקודות
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Certification & Origin */}
              <div className="card">
                <h3 className="font-semibold mb-3">פרטי מקור</h3>
                <div className="space-y-3">
                  {result.certification && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">תעודת כשרות:</span>
                      <span className="font-medium">{result.certification}</span>
                    </div>
                  )}
                  {result.origin && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">מקור:</span>
                      <span className="font-medium">{result.origin}</span>
                    </div>
                  )}
                  {result.harvest && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">תאריך קטיף:</span>
                      <span className="font-medium">{result.harvest}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Business Tab */}
          {activeTab === 'business' && userProfile === 'merchant' && (
            <div className="space-y-6">
              {/* Business Insights */}
              {result.businessInsights && (
                <div className="card">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    ניתוח עסקי
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">מחיר משוער:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₪{result.businessInsights.estimatedPrice}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">רווחיות:</span>
                      <span className="font-medium text-green-600">
                        {result.businessInsights.profitMargin}
                      </span>
                    </div>
                    {result.businessInsights.marketDemand && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">ביקוש שוק:</span>
                        <span className="font-medium">{result.businessInsights.marketDemand}</span>
                      </div>
                    )}
                    {result.businessInsights.competitorPrice && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">מחיר מתחרים:</span>
                        <span className="font-medium">₪{result.businessInsights.competitorPrice}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Market Grade */}
              {result.marketGrade && (
                <div className="card">
                  <h3 className="font-semibold mb-3">דרגת שוק</h3>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${result.marketGrade.grade === 'A+' ? 'bg-emerald-500' :
                      result.marketGrade.grade === 'A' ? 'bg-blue-500' :
                        result.marketGrade.grade === 'B' ? 'bg-orange-500' :
                          result.marketGrade.grade === 'C' ? 'bg-yellow-500' :
                            'bg-red-500'
                      }`}>
                      {result.marketGrade.grade}
                    </div>
                    <div>
                      <div className="font-medium">{result.marketGrade.name}</div>
                      {result.marketGrade.premium && (
                        <div className="text-sm text-gray-600">{result.marketGrade.premium}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Export Category */}
              {result.exportCategory && (
                <div className="card">
                  <h3 className="font-semibold mb-3">קטגוריית יצוא</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">שוק יעד:</span>
                      <span className="font-medium">{result.exportCategory.market}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">איכות:</span>
                      <span className="font-medium">{result.exportCategory.quality}</span>
                    </div>
                    {result.exportCategory.requirements && (
                      <div>
                        <span className="text-sm text-gray-600">דרישות:</span>
                        <div className="text-sm mt-1">{result.exportCategory.requirements}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              {result.businessInsights?.recommendation && (
                <div className="card bg-blue-50 border-blue-200">
                  <h3 className="font-semibold mb-3 text-blue-800">המלצה עסקית</h3>
                  <p className="text-blue-700">{result.businessInsights.recommendation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleNewScan}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            סריקה חדשה
          </button>
          <button
            onClick={handleViewHistory}
            className="btn-outline flex-1 flex items-center justify-center gap-2"
          >
            <History className="w-5 h-5" />
            היסטוריה
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen; 