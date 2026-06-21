import { 
  EtrogCategory, 
  ExportCategoryData, 
  MarketGradeData, 
  DefectData,
  MarketPrices
} from '@/types';

// Primary Etrog Categories
export const etrogCategories = {
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
    },
    { 
      id: 'revi_round', 
      name: 'רביעי עגול', 
      price: '150-250 ₪',
      priceUSD: '$40-70',
      description: 'איכות בסיסית',
      marketDemand: 'בינוני',
      seasonality: 'כל השנה',
      profitMargin: '20-30%'
    },
    { 
      id: 'chinuch', 
      name: 'חינוך', 
      price: '50-100 ₪',
      priceUSD: '$15-30',
      description: 'ללימוד והדרכה',
      marketDemand: 'נמוך',
      seasonality: 'כל השנה',
      profitMargin: '15-25%'
    }
  ] as EtrogCategory[],

  export: [
    { 
      id: 'sorotzkin', 
      name: 'סורוצקין', 
      market: 'יצוא',
      quality: 'premium',
      destinations: ['ניו יורק', 'לונדון', 'אנטוורפן'],
      requirements: 'תעודת כשרות בד"ץ',
      shipping: 'אווירי מקורר'
    },
    { 
      id: 'store', 
      name: 'חנות', 
      market: 'מכירה בארץ',
      quality: 'standard',
      destinations: ['ירושלים', 'בני ברק', 'מודיעין עילית'],
      requirements: 'תעודת כשרות רבנות',
      shipping: 'הובלה יבשתית'
    }
  ] as ExportCategoryData[],

  market: [
    { id: 'shuk_anash', name: 'שוק אנש', grade: 'A+', color: 'emerald', premium: '+25%' },
    { id: 'shuk_a', name: 'א שוק', grade: 'A', color: 'blue', premium: '+15%' },
    { id: 'shuk_b', name: 'ב שוק', grade: 'B', color: 'orange', premium: '0%' },
    { id: 'shuk_c', name: 'ג שוק', grade: 'C', color: 'yellow', premium: '-15%' },
    { id: 'lo_sachir', name: 'לא סחיר', grade: 'לא מתאים', color: 'red', premium: '-100%' }
  ] as MarketGradeData[],

  defects: [
    { name: 'קווקב במיץ', severity: 'critical', halachic: 'פוסל' },
    { name: 'חתיכת עץ בולטת', severity: 'critical', halachic: 'פוסל' },
    { name: 'נקודות שחורות', severity: 'moderate', halachic: 'תלוי במיקום וגודל' },
    { name: 'כתמים', severity: 'minor', halachic: 'כשר ברוב המקרים' },
    { name: 'שריטות', severity: 'minor', halachic: 'כשר' },
    { name: 'צורה לא תקינה', severity: 'moderate', halachic: 'תלוי בסטיה' }
  ] as DefectData[]
};

// Market Prices Database
export const marketPrices: MarketPrices = {
  current: {
    'rishon': { avg: 650, trend: '+5%', lastWeek: 620 },
    'sheni': { avg: 400, trend: '+3%', lastWeek: 390 },
    'shlishi_square': { avg: 250, trend: '-2%', lastWeek: 255 },
    'revi_round': { avg: 200, trend: '0%', lastWeek: 200 },
    'chinuch': { avg: 75, trend: '+10%', lastWeek: 68 }
  },
  locations: {
    'jerusalem': { modifier: 1.1, name: 'ירושלים' },
    'bnei_brak': { modifier: 1.15, name: 'בני ברק' },
    'modiin_illit': { modifier: 1.05, name: 'מודיעין עילית' },
    'netanya': { modifier: 0.95, name: 'נתניה' },
    'haifa': { modifier: 0.9, name: 'חיפה' }
  }
};

// AI Processing Steps
export const processingSteps = {
  basic: [
    { name: 'מנתח תמונה...', progress: 25, delay: 400 },
    { name: 'בוחן כשרות...', progress: 60, delay: 600 },
    { name: 'מסיים...', progress: 100, delay: 300 }
  ],
  standard: [
    { name: 'טוען תמונה...', progress: 10, delay: 300 },
    { name: 'מנתח צורה וגודל...', progress: 30, delay: 500 },
    { name: 'בוחן צבעים ומרקם...', progress: 50, delay: 400 },
    { name: 'מחפש פגמים...', progress: 70, delay: 600 },
    { name: 'מסווג לקטגוריות...', progress: 85, delay: 400 },
    { name: 'מסיים עיבוד...', progress: 100, delay: 300 }
  ],
  comprehensive: [
    { name: 'טוען תמונה...', progress: 5, delay: 200 },
    { name: 'מנתח רזולוציה ואיכות...', progress: 10, delay: 300 },
    { name: 'זיהוי צורה גיאומטרית...', progress: 20, delay: 500 },
    { name: 'בדיקת יחסי גובה-רוחב...', progress: 30, delay: 400 },
    { name: 'ניתוח ספקטרלי של צבעים...', progress: 45, delay: 600 },
    { name: 'זיהוי מרקם ופני שטח...', progress: 55, delay: 500 },
    { name: 'סריקת פגמים מיקרוסקופיים...', progress: 70, delay: 700 },
    { name: 'בדיקת סימני הרכבה...', progress: 80, delay: 600 },
    { name: 'מיון לקטגוריות מסחריות...', progress: 90, delay: 400 },
    { name: 'חישוב הערכת מחיר...', progress: 95, delay: 300 },
    { name: 'יצירת דוח מקיף...', progress: 100, delay: 200 }
  ]
};

// Camera Settings
export const cameraSettings = {
  high: {
    width: 1920,
    height: 1080,
    frameRate: 30
  },
  medium: {
    width: 1280,
    height: 720,
    frameRate: 30
  },
  low: {
    width: 854,
    height: 480,
    frameRate: 24
  }
};

// App Constants
export const APP_CONSTANTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  ERROR_TIMEOUT: 5000,
  HISTORY_LIMIT: 100,
  BATCH_LIMIT: 20
};

// Localization
export const translations = {
  he: {
    app: {
      title: 'זיהוי אתרוגים AI',
      subtitle: 'מערכת מקצועית לסוחרים',
      loading: 'טוען...',
      error: 'שגיאה',
      success: 'הצלחה',
      cancel: 'ביטול',
      confirm: 'אישור',
      back: 'חזור',
      next: 'המשך',
      save: 'שמור',
      delete: 'מחק',
      edit: 'ערוך',
      share: 'שתף',
      export: 'יצוא',
      import: 'ייבוא',
      settings: 'הגדרות',
      help: 'עזרה',
      about: 'אודות'
    },
    camera: {
      title: 'מצלמה',
      capture: 'צלם',
      switch: 'החלף מצלמה',
      quality: 'איכות',
      guide: 'מקם את האתרוג במרכז המסגרת'
    },
    processing: {
      title: 'מעבד תמונה...',
      analyzing: 'הבינה המלאכותית בוחנת את האתרוג',
      progress: 'הושלם'
    },
    result: {
      kosher: 'אתרוג כשר',
      invalid: 'אתרוג לא כשר',
      uncertain: 'לא ברור',
      confidence: 'רמת וודאות AI',
      details: 'פרטים',
      defects: 'פגמים שזוהו',
      measurements: 'מדידות מדויקות',
      business: 'ניתוח עסקי מתקדם',
      halachic: 'פסיקה הלכתית'
    }
  },
  en: {
    app: {
      title: 'Etrog Identifier AI',
      subtitle: 'Professional System for Merchants',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      share: 'Share',
      export: 'Export',
      import: 'Import',
      settings: 'Settings',
      help: 'Help',
      about: 'About'
    },
    camera: {
      title: 'Camera',
      capture: 'Capture',
      switch: 'Switch Camera',
      quality: 'Quality',
      guide: 'Position the etrog in the center of the frame'
    },
    processing: {
      title: 'Processing Image...',
      analyzing: 'AI is analyzing the etrog',
      progress: 'Complete'
    },
    result: {
      kosher: 'Kosher Etrog',
      invalid: 'Non-Kosher Etrog',
      uncertain: 'Uncertain',
      confidence: 'AI Confidence Level',
      details: 'Details',
      defects: 'Identified Defects',
      measurements: 'Precise Measurements',
      business: 'Advanced Business Analysis',
      halachic: 'Halachic Ruling'
    }
  }
}; 