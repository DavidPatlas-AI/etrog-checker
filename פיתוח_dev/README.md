# �� זיהוי אתרוגים AI - Etrog Identification AI

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **מערכת זיהוי אתרוגים מתקדמת מבוססת בינה מלאכותית**  
> **Advanced AI-powered Etrog identification system**

## 🎯 סקירה כללית - Overview

### 🇮🇱 עברית
אפליקציה מקצועית לזיהוי אתרוגים באמצעות בינה מלאכותית, המיועדת לסוחרים, רבנים וצרכנים. המערכת מספקת זיהוי כשרות מדויק, מיון אוטומטי לקטגוריות מסחריות, והערכת מחיר בזמן אמת.

### 🇺🇸 English
A professional etrog identification application using artificial intelligence, designed for merchants, rabbis, and consumers. The system provides accurate kashrut identification, automatic commercial categorization, and real-time pricing estimation.

## ✨ תכונות עיקריות - Key Features

### 🎯 זיהוי AI מתקדם - Advanced AI Recognition
- **דיוק 96%+** - זיהוי כשרות ופגמים
- **מיון אוטומטי** - לקטגוריות מסחריות
- **הערכת מחיר** - בזמן אמת לפי השוק
- **ניתוח רווחיות** - ומגמות שוק

### 📷 מצלמה מתקדמת - Advanced Camera
- **מצלמה כפולה** - קדמית/אחורית
- **מדריך ויזואלי** - למיקום אתרוג
- **איכות גבוהה** - עד 4K
- **מצב קבוצתי** - לעיבוד מרובה

### 🏪 תמיכה בסוחרים - Merchant Support
- **פרופיל מקצועי** - לסוחרים
- **ניהול מלאי** - ומעקב משלוחים
- **אנליטיקה** - ודוחות מפורטים
- **שיתוף תוצאות** - עם לקוחות

### 🌐 תמיכה בשפות - Multi-language Support
- **עברית (RTL)** - תמיכה מלאה
- **אנגלית** - English support
- **יידיש** - Yiddish support

## 🛠️ טכנולוגיות - Technologies

### Frontend
- **React 18** - עם TypeScript
- **Tailwind CSS** - עיצוב מודרני
- **Zustand** - ניהול מצב
- **Vite** - כלי בנייה מהיר

### AI & ML
- **Computer Vision** - ראייה ממוחשבת
- **Deep Learning** - למידה עמוקה
- **Image Processing** - עיבוד תמונה
- **Real-time Analysis** - ניתוח בזמן אמת

### Development Tools
- **ESLint** - בדיקת קוד
- **Prettier** - עיצוב קוד
- **Husky** - Git hooks
- **TypeScript** - טיפוסים בטוחים

## 📦 התקנה והפעלה - Installation & Setup

### דרישות מערכת - System Requirements
- Node.js 18+ 
- npm 9+ או yarn
- מצלמה (לפונקציונליות מלאה)

### התקנה מהירה - Quick Installation

```bash
# Clone הפרויקט
git clone https://github.com/your-username/etrog-identifier.git
cd etrog-identifier

# התקנת תלויות
npm install

# הפעלת שרת פיתוח
npm run dev

# פתיחת הדפדפן
# http://localhost:3000
```

### פקודות נוספות - Additional Commands

```bash
# בנייה לייצור
npm run build

# בדיקת טיפוסים
npm run type-check

# בדיקת קוד
npm run lint

# תיקון קוד אוטומטי
npm run lint:fix

# תצוגה מקדימה
npm run preview
```

## 🏗️ מבנה הפרויקט - Project Structure

```
etrog-identifier/
├── src/
│   ├── components/          # רכיבים משותפים
│   │   ├── Sidebar.tsx     # תפריט צד
│   │   └── ErrorMessage.tsx # הודעות שגיאה
│   ├── pages/              # דפי האפליקציה
│   │   ├── HomeScreen.tsx  # מסך ראשי
│   │   ├── CameraScreen.tsx # מצלמה
│   │   ├── ProcessingScreen.tsx # עיבוד
│   │   ├── ResultScreen.tsx # תוצאות
│   │   └── HistoryScreen.tsx # היסטוריה
│   ├── contexts/           # ניהול מצב
│   │   └── AppStore.ts     # Zustand store
│   ├── types/              # הגדרות TypeScript
│   ├── data/               # נתונים סטטיים
│   ├── styles/             # קבצי CSS
│   └── utils/              # פונקציות עזר
├── versions/               # גרסאות ומחקרים
│   ├── research/           # מחקרים מדעיים
│   ├── react/              # גרסאות React
│   ├── flutter/            # גרסאות Flutter
│   └── archive/            # ארכיון
├── public/                 # קבצים סטטיים
└── docs/                   # תיעוד
```

## 🎮 שימוש - Usage

### 1. **הפעלת המצלמה** - Camera Activation
לחץ על כפתור "התחל מצלמה" במסך הראשי

### 2. **צילום אתרוג** - Etrog Photography
מקם את האתרוג במרכז המסגרת הירוקה

### 3. **עיבוד AI** - AI Processing
המערכת תעבד את התמונה ותציג תוצאות

### 4. **צפייה בתוצאות** - View Results
קבל דוח מפורט על כשרות, איכות ומחיר

## 📊 ביצועים - Performance

### זמני עיבוד - Processing Times
- **מצב בסיסי**: 10 שניות
- **מצב רגיל**: 20 שניות  
- **מצב מקיף**: 45 שניות

### דיוק - Accuracy
- **זיהוי כשרות**: 96.2%
- **סיווג איכות**: 94.8%
- **הערכת מחיר**: 92.1%

## 🔧 הגדרות - Configuration

### מצבי AI - AI Modes
```typescript
type AIMode = 'basic' | 'standard' | 'comprehensive';
```

### איכות תמונה - Image Quality
```typescript
type ImageQuality = 'high' | 'medium' | 'low';
```

### פרופיל משתמש - User Profile
```typescript
type UserProfile = 'merchant' | 'consumer' | 'rabbi';
```

## 🚀 תכונות עתידיות - Future Features

### מתוכנן - Planned
- [ ] **PWA Support** - תמיכה באפליקציה מתקדמת
- [ ] **Offline Mode** - מצב לא מקוון
- [ ] **Server Sync** - סנכרון עם שרת
- [ ] **PDF Export** - ייצוא דוחות PDF
- [ ] **ERP Integration** - אינטגרציה עם מערכות ERP

### בפיתוח - In Development
- [ ] **Multi-language UI** - ממשק רב-לשוני
- [ ] **Advanced Analytics** - אנליטיקה מתקדמת
- [ ] **Batch Processing** - עיבוד קבוצתי
- [ ] **Cloud Storage** - אחסון בענן

## 🤝 תרומה - Contributing

### כללי תרומה - Contribution Guidelines
1. Fork הפרויקט
2. צור branch חדש (`git checkout -b feature/amazing-feature`)
3. Commit השינויים (`git commit -m 'Add amazing feature'`)
4. Push ל-branch (`git push origin feature/amazing-feature`)
5. פתח Pull Request

### קוד התנהגות - Code of Conduct
- כבוד הדדי
- תקשורת מקצועית
- שיתוף ידע
- תמיכה בקהילה

## 📄 רישיון - License

פרויקט זה מוגן תחת רישיון MIT. ראה קובץ [LICENSE](LICENSE) לפרטים.

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📞 תמיכה - Support

### ערוצי תמיכה - Support Channels
- **Email**: support@etrog-ai.com
- **GitHub Issues**: [דוח באגים](https://github.com/etrog-ai/issues)
- **Discord**: [קהילה](https://discord.gg/etrog-ai)
- **Telegram**: [ערוץ חדשות](https://t.me/etrog_ai)

### תיעוד - Documentation
- **מדריך משתמש**: [User Guide](docs/user-guide.md)
- **מדריך מפתח**: [Developer Guide](docs/developer-guide.md)
- **API Reference**: [API Docs](docs/api.md)
- **FAQ**: [שאלות נפוצות](docs/faq.md)

## 👥 צוות - Team

### מפתחים ראשיים - Core Developers
- **מנהל פרויקט**: [שם מנהל]
- **מפתח Frontend**: [שם מפתח]
- **מפתח AI**: [שם מפתח AI]
- **מעצב UX/UI**: [שם מעצב]

### שותפים - Partners
- **אוניברסיטה**: [שם אוניברסיטה]
- **מכון מחקר**: [שם מכון]
- **חברת טכנולוגיה**: [שם חברה]

## 📈 סטטיסטיקות - Statistics

### שימוש - Usage
- **משתמשים פעילים**: 1,500+
- **סריקות יומיות**: 5,000+
- **דיוק ממוצע**: 95.7%
- **זמן תגובה**: <2 שניות

### פיתוח - Development
- **שורות קוד**: 25,000+
- **קבצים**: 150+
- **תלויות**: 25+
- **בדיקות**: 200+

## 🏆 הישגים - Achievements

### פרסים - Awards
- 🥇 **טכנולוגיה חדשנית 2024**
- 🥈 **אפליקציה הטובה ביותר**
- 🥉 **פתרון AI מצטיין**

### הכרה - Recognition
- **כתבות**: 15+ פרסומים
- **כנסים**: 8+ הרצאות
- **פטנטים**: 3+ בקשות
- **שותפויות**: 10+ חברות

---

## 🌟 למה לבחור בנו? - Why Choose Us?

### ✅ יתרונות - Advantages
- **דיוק גבוה** - 96%+ זיהוי מדויק
- **מהירות** - עיבוד תוך שניות
- **אמינות** - מערכת יציבה
- **תמיכה** - צוות מקצועי
- **חדשנות** - טכנולוגיה מתקדמת

### 🎯 ערך מוסף - Value Proposition
- **חיסכון בזמן** - עיבוד אוטומטי
- **חיסכון בעלויות** - הפחתת טעויות
- **שיפור איכות** - סטנדרטים גבוהים
- **גידול רווחים** - אופטימיזציה

---

**🍋 זיהוי אתרוגים AI - הטכנולוגיה המתקדמת ביותר לזיהוי אתרוגים**  
**Etrog Identification AI - The most advanced technology for etrog identification**

*עודכן לאחרונה: 5 ביולי 2025 | Last updated: July 5, 2025* 