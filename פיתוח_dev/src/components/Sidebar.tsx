import React from 'react';
import { 
  Home, 
  History, 
  BarChart3, 
  Package, 
  Settings, 
  X,
  User,
  Globe
} from 'lucide-react';
import { useAppStore } from '@/contexts/AppStore';

const Sidebar: React.FC = () => {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    setCurrentView,
    history,
    userProfile,
    setUserProfile,
    language,
    setLanguage,
    darkMode,
    setDarkMode
  } = useAppStore();

  const handleNavigation = (view: string) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-800">תפריט ראשי</h2>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <nav className="space-y-4">
          <button 
            onClick={() => handleNavigation('home')}
            className="w-full flex items-center gap-3 p-3 text-right hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            בית
          </button>
          
          <button 
            onClick={() => handleNavigation('history')}
            className="w-full flex items-center gap-3 p-3 text-right hover:bg-gray-100 rounded-lg transition-colors"
          >
            <History className="w-5 h-5" />
            היסטוריה ({history && history.length})
          </button>
          
          <button 
            onClick={() => handleNavigation('analytics')}
            className="w-full flex items-center gap-3 p-3 text-right hover:bg-gray-100 rounded-lg transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            אנליטיקה ודוחות
          </button>
          
          <button 
            onClick={() => handleNavigation('inventory')}
            className="w-full flex items-center gap-3 p-3 text-right hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Package className="w-5 h-5" />
            ניהול מלאי
          </button>
          
          <button 
            onClick={() => handleNavigation('settings')}
            className="w-full flex items-center gap-3 p-3 text-right hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            הגדרות מתקדמות
          </button>
        </nav>
        
        {/* User profile section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            פרופיל משתמש
          </div>
          <select 
            value={userProfile} 
            onChange={(e) => setUserProfile(e.target.value as any)}
            className="w-full p-2 border rounded text-sm mb-3"
          >
            <option value="merchant">סוחר מקצועי</option>
            <option value="consumer">צרכן</option>
            <option value="rabbi">רב/פוסק</option>
          </select>
          
          <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            שפה
          </div>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as any)}
            className="w-full p-2 border rounded text-sm mb-3"
          >
            <option value="he">עברית</option>
            <option value="en">English</option>
            <option value="yi">יידיש</option>
          </select>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">מצב כהה</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        
        {/* App info */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <div>זיהוי אתרוגים AI</div>
            <div>גרסה 1.0.0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 