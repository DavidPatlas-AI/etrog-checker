import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Trash2, 
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useAppStore } from '@/contexts/AppStore';
import { HistoryItem } from '@/types';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

const HistoryScreen: React.FC = () => {
  const { history, clearHistory, setCurrentView, setResult } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'kosher' | 'invalid' | 'uncertain'>('all');

  const filteredHistory = history.filter(item => {
    const matchesSearch = (item.result.variety && item.result.variety.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || item.result.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewResult = (item: HistoryItem) => {
    setResult(item.result);
    setCurrentView('result');
  };

  const handleClearHistory = () => {
    if (confirm('האם אתה בטוח שברצונך למחוק את כל ההיסטוריה?')) {
      clearHistory();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'kosher':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'invalid':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'uncertain':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'kosher':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'invalid':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'uncertain':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
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
            
            <h1 className="text-xl font-bold text-gray-800">היסטוריית בדיקות</h1>
            
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              נקה הכל
            </button>
          </div>
        </div>
      </div>

      <div className="container-responsive py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">{history && history.length}</div>
            <div className="text-xs text-gray-600">סה"כ בדיקות</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">
              {history && history.filter(h => h.result.status === 'kosher').length}
            </div>
            <div className="text-xs text-gray-600">כשרים</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-600">
              {history && history.filter(h => h.result.status === 'invalid').length}
            </div>
            <div className="text-xs text-gray-600">לא כשרים</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="חיפוש לפי זן או ספק..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">כל הסטטוסים</option>
                <option value="kosher">כשרים</option>
                <option value="invalid">לא כשרים</option>
                <option value="uncertain">לא ברור</option>
              </select>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {filteredHistory && filteredHistory.length === 0 ? (
            <div className="card text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">אין היסטוריה</h3>
              <p className="text-gray-500 mb-4">עדיין לא ביצעת בדיקות</p>
              <button
                onClick={() => setCurrentView('home')}
                className="btn-primary"
              >
                התחל בדיקה ראשונה
              </button>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div key={item.id} className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewResult(item)}>
                <div className="flex items-start gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt="אתרוג" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.result.status)}
                        <h3 className="font-semibold text-gray-800 truncate">
                          {item.result.variety || 'אתרוג'}
                        </h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.result.status)}`}>
                        {item.result.status === 'kosher' ? 'כשר' : 
                         item.result.status === 'invalid' ? 'לא כשר' : 'לא ברור'}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(item.timestamp, 'dd/MM/yyyy HH:mm', { locale: he })}</span>
                      </div>
                      
                      {item.supplier && (
                        <div>ספק: {item.supplier}</div>
                      )}
                      
                      {item.result.category && (
                        <div>קטגוריה: {item.result.category.name}</div>
                      )}
                      
                      <div>דיוק AI: {Math.round(item.result.confidence * 100)}%</div>
                    </div>

                    {/* Defects preview */}
                    {item.result.defects && item.result.defects.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-red-600 font-medium">פגמים:</div>
                        <div className="text-xs text-gray-600">
                          {item.result.defects && item.result.defects.slice(0, 2).join(', ')}
                          {item.result.defects && item.result.defects.length > 2 && ` +${item.result.defects.length - 2} נוספים`}
                        </div>
                      </div>
                    )}

                    {/* Business info for merchants */}
                    {item.result.businessInsights && (
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <div className="text-green-600 font-medium">
                          ₪{item.result.businessInsights.estimatedPrice}
                        </div>
                        <div className="text-gray-600">
                          {item.result.businessInsights.profitMargin}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Export button */}
        {history && history.length > 0 && (
          <div className="mt-8 text-center">
            <button className="btn-outline flex items-center gap-2 mx-auto">
              <Download className="w-5 h-5" />
              ייצא היסטוריה ל-Excel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryScreen; 