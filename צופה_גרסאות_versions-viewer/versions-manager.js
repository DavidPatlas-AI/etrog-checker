/**
 * 🍋 בודק אתרוגים - מנהל גרסאות
 * קובץ JavaScript לניהול דינמי של כל הגרסאות בפרויקט
 */

class VersionsManager {
    constructor() {
        this.versions = {
            claude: {
                name: "Claude AI",
                icon: "🤖",
                color: "#FF6B35",
                files: [
                    {
                        name: "etrog-advanced-analyzer.html",
                        path: "גרסאות_versions/claude/etrog-advanced-analyzer.html",
                        size: "45KB",
                        lines: 1200,
                        status: "active",
                        description: "מנתח אתרוגים מתקדם - זיהוי זנים ובדיקת כשרות הלכתית"
                    },
                    {
                        name: "etrog-html-app.html",
                        path: "גרסאות_versions/claude/etrog-html-app.html",
                        size: "42KB",
                        lines: 1361,
                        status: "active",
                        description: "גרסה מתקדמת של אפליקציית HTML לזיהוי אתרוגים"
                    },
                    {
                        name: "etrog-html-app (1).html",
                        path: "גרסאות_versions/claude/etrog-html-app (1).html",
                        size: "28KB",
                        lines: 938,
                        status: "active",
                        description: "עותק של גרסת HTML המתקדמת"
                    },
                    {
                        name: "fixed-etrog-app.tsx",
                        path: "גרסאות_versions/claude/fixed-etrog-app.tsx",
                        size: "38KB",
                        lines: 1052,
                        status: "active",
                        description: "גרסה פעילה ויציבה"
                    },
                    {
                        name: "fixed-etrog-app (1).tsx",
                        path: "גרסאות_versions/claude/fixed-etrog-app (1).tsx",
                        size: "76KB",
                        lines: 1772,
                        status: "experimental",
                        description: "גרסה ניסיונית מורחבת"
                    },
                    {
                        name: "fixed-etrog-app (2).tsx",
                        path: "גרסאות_versions/claude/fixed-etrog-app (2).tsx",
                        size: "41KB",
                        lines: 1002,
                        status: "experimental",
                        description: "גרסה ניסיונית מתוקנת"
                    },
                    {
                        name: "remixed-229c488f.tsx",
                        path: "גרסאות_versions/claude/remixed-229c488f.tsx",
                        size: "43KB",
                        lines: 1067,
                        status: "experimental",
                        description: "גרסה ניסיונית נוספת"
                    },
                    {
                        name: "remixed-229c488f (1).tsx",
                        path: "גרסאות_versions/claude/remixed-229c488f (1).tsx",
                        size: "39KB",
                        lines: 1023,
                        status: "experimental",
                        description: "גרסה ניסיונית נוספת"
                    },
                    {
                        name: "index.html",
                        path: "גרסאות_versions/claude/index.html",
                        size: "39KB",
                        lines: 1023,
                        status: "active",
                        description: "דף HTML ראשי"
                    }
                ]
            },
            react: {
                name: "React",
                icon: "⚛️",
                color: "#61DAFB",
                files: [
                    {
                        name: "etrog_identifier_mvp.tsx",
                        path: "גרסאות_versions/react/v1.0.0/etrog_identifier_mvp.tsx",
                        size: "1B",
                        lines: 1,
                        status: "archive",
                        description: "גרסה ראשונית"
                    },
                    {
                        name: "1etrog_identifier_mvp.tsx",
                        path: "גרסאות_versions/react/v1.0.0/1etrog_identifier_mvp.tsx",
                        size: "1B",
                        lines: 1,
                        status: "archive",
                        description: "גרסה ראשונית נוספת"
                    },
                    {
                        name: "README.md",
                        path: "גרסאות_versions/react/v1.0.0/README.md",
                        size: "3.1KB",
                        lines: 117,
                        status: "active",
                        description: "תיעוד React"
                    }
                ]
            },
            flutter: {
                name: "Flutter",
                icon: "📱",
                color: "#02569B",
                files: [
                    {
                        name: "etrog_identification_app.dart",
                        path: "גרסאות_versions/flutter/v1.0.0/etrog_identification_app.dart",
                        size: "1B",
                        lines: 1,
                        status: "archive",
                        description: "גרסה למובייל"
                    },
                    {
                        name: "etrog_identification_app (1).dart",
                        path: "גרסאות_versions/flutter/v1.0.0/etrog_identification_app (1).dart",
                        size: "1B",
                        lines: 1,
                        status: "archive",
                        description: "גרסה למובייל נוספת"
                    }
                ]
            },
            research: {
                name: "מחקר",
                icon: "🔬",
                color: "#28a745",
                files: [
                    {
                        name: "README.md",
                        path: "גרסאות_versions/research/README.md",
                        size: "4.6KB",
                        lines: 158,
                        status: "active",
                        description: "תיעוד מחקר"
                    },
                    {
                        name: "compass_artifact_wf-9abea104-6548-4f8e-b397-87696a6bd6b6_text_markdown.md",
                        path: "גרסאות_versions/research/papers/compass_artifact_wf-9abea104-6548-4f8e-b397-87696a6bd6b6_text_markdown.md",
                        size: "1B",
                        lines: 1,
                        status: "active",
                        description: "מאמר מחקר 1"
                    },
                    {
                        name: "compass_artifact_wf-d6ea9ac9-fc37-4f4d-84e1-ce7fb47b422b_text_markdown.md",
                        path: "גרסאות_versions/research/papers/compass_artifact_wf-d6ea9ac9-fc37-4f4d-84e1-ce7fb47b422b_text_markdown.md",
                        size: "1B",
                        lines: 1,
                        status: "active",
                        description: "מאמר מחקר 2"
                    },
                    {
                        name: "halacha-research.md",
                        path: "גרסאות_versions/research/halacha-research.md",
                        size: "15KB",
                        lines: 300,
                        status: "active",
                        description: "מחקר הלכתי מקיף - בדיקת אתרוגים, זיהוי זנים, בלטלך, רסיסוס"
                    },
                    {
                        name: "בודק אתרוגים מחקר2.pdf",
                        path: "גרסאות_versions/research/papers/בודק אתרוגים מחקר2.pdf",
                        size: "1B",
                        lines: 1,
                        status: "active",
                        description: "מחקר בודק אתרוגים 2"
                    },
                    {
                        name: "אני אחפש עבורך מידע על אתרים לזיהוי זן אתרוג ובדיקת הכשרות שלהם….pdf",
                        path: "גרסאות_versions/research/papers/אני אחפש עבורך מידע על אתרים לזיהוי זן אתרוג ובדיקת הכשרות שלהם….pdf",
                        size: "259KB",
                        lines: 2024,
                        status: "active",
                        description: "מחקר מקיף על זיהוי אתרוגים"
                    },
                    {
                        name: "אני אחפש עבורך מידע על אתרים לזיהוי זן אתרוג ובדיקת הכשרות שלהם.pdf",
                        path: "גרסאות_versions/research/papers/אני אחפש עבורך מידע על אתרים לזיהוי זן אתרוג ובדיקת הכשרות שלהם.pdf",
                        size: "259KB",
                        lines: 2024,
                        status: "active",
                        description: "מחקר מקיף על זיהוי זנים ובדיקת כשרות"
                    },
                    {
                        name: "זני האתרוגים הכשרים לברכה בישראל – סקירה מקיפה.pdf",
                        path: "גרסאות_versions/research/papers/זני האתרוגים הכשרים לברכה בישראל – סקירה מקיפה.pdf",
                        size: "140KB",
                        lines: 750,
                        status: "active",
                        description: "סקירה מקיפה של זני אתרוגים בישראל"
                    },
                    {
                        name: "מערכת לזיהוי כשרות ופגמי אתרוג – סקירה מעשית.pdf",
                        path: "גרסאות_versions/research/papers/מערכת לזיהוי כשרות ופגמי אתרוג – סקירה מעשית.pdf",
                        size: "107KB",
                        lines: 585,
                        status: "active",
                        description: "מדריך מעשי לבניית מערכת זיהוי"
                    },
                    {
                        name: "הנחיות לקרוסר אתרוגים.docx",
                        path: "גרסאות_versions/research/papers/הנחיות לקרוסר אתרוגים.docx",
                        size: "13KB",
                        lines: 34,
                        status: "active",
                        description: "הנחיות מפורטות לפרויקט קרוסר"
                    },
                    {
                        name: "מערכת חכמה לזיהוי אתרוגים כשרים – מחקר רב-תחומי.pdf",
                        path: "גרסאות_versions/research/papers/מערכת חכמה לזיהוי אתרוגים כשרים – מחקר רב-תחומי.pdf",
                        size: "1.3MB",
                        lines: 0,
                        status: "active",
                        description: "מחקר רב-תחומי חדש על מערכת חכמה לזיהוי אתרוגים כשרים"
                    }
                ]
            },
            archive: {
                name: "ארכיון",
                icon: "📦",
                color: "#6c757d",
                files: [
                    {
                        name: "README.md",
                        path: "גרסאות_versions/README.md",
                        size: "2.5KB",
                        lines: 67,
                        status: "archive",
                        description: "תיעוד ארכיון"
                    }
                ]
            }
        };
    }

    /**
     * מחזיר את כל הגרסאות
     */
    getAllVersions() {
        return this.versions;
    }

    /**
     * מחזיר גרסה ספציפית לפי שם
     */
    getVersion(versionName) {
        return this.versions[versionName];
    }

    /**
     * מחזיר קבצים לפי סטטוס
     */
    getFilesByStatus(status) {
        const files = [];
        Object.values(this.versions).forEach(version => {
            version.files.forEach(file => {
                if (file.status === status) {
                    files.push({
                        ...file,
                        category: version.name,
                        categoryIcon: version.icon
                    });
                }
            });
        });
        return files;
    }

    /**
     * מחזיר סטטיסטיקות
     */
    getStatistics() {
        let totalFiles = 0;
        let totalSize = 0;
        let activeFiles = 0;
        let experimentalFiles = 0;
        let archiveFiles = 0;

        Object.values(this.versions).forEach(version => {
            version.files.forEach(file => {
                totalFiles++;

                // חישוב גודל (אם אפשר)
                const size = file.size ? file.size.replace('KB', '').replace('B', '') : '0';
                if (!isNaN(size)) {
                    totalSize += parseInt(size);
                }

                // ספירת לפי סטטוס
                switch (file.status) {
                    case 'active':
                        activeFiles++;
                        break;
                    case 'experimental':
                        experimentalFiles++;
                        break;
                    case 'archive':
                        archiveFiles++;
                        break;
                }
            });
        });

        return {
            totalFiles,
            totalSize: `${totalSize}KB`,
            activeFiles,
            experimentalFiles,
            archiveFiles,
            categories: Object.keys(this.versions).length
        };
    }

    /**
     * מחפש קבצים לפי טקסט
     */
    searchFiles(query) {
        const results = [];
        const searchTerm = query.toLowerCase();

        Object.values(this.versions).forEach(version => {
            version.files.forEach(file => {
                if ((file.name && file.name.toLowerCase().includes(searchTerm)) ||
                    (file.description && file.description.toLowerCase().includes(searchTerm)) ||
                    (file.path && file.path.toLowerCase().includes(searchTerm))) {
                    results.push({
                        ...file,
                        category: version.name,
                        categoryIcon: version.icon
                    });
                }
            });
        });

        return results;
    }

    /**
     * מחזיר את הגרסה הפעילה הראשית
     */
    getMainVersion() {
        const claudeVersion = this.versions.claude;
        return claudeVersion.files.find(file => file.status === 'active');
    }

    /**
     * מחזיר היסטוריית גרסאות
     */
    getVersionHistory() {
        const history = [];

        Object.values(this.versions).forEach(version => {
            version.files.forEach(file => {
                history.push({
                    name: file.name,
                    category: version.name,
                    status: file.status,
                    size: file.size,
                    path: file.path,
                    timestamp: this.getFileTimestamp(file.path)
                });
            });
        });

        return history.sort((a, b) => b.timestamp - a.timestamp);
    }

    /**
     * מחזיר תאריך משוער לקובץ (לצורך הדגמה)
     */
    getFileTimestamp(filePath) {
        // בפועל, זה יהיה התאריך האמיתי של הקובץ
        const baseTime = new Date('2024-01-01').getTime();
        const randomOffset = Math.random() * 365 * 24 * 60 * 60 * 1000; // שנה אקראית
        return baseTime + randomOffset;
    }

    /**
     * יוצר HTML עבור גרסה
     */
    generateVersionHTML(versionName) {
        const version = this.versions[versionName];
        if (!version) return '';

        let html = `
            <div class="version-section">
                <div class="section-header">
                    <div class="section-icon" style="background: ${version.color}">${version.icon}</div>
                    <div>
                        <div class="section-title">${version.name}</div>
                        <div class="section-description">${this.getVersionDescription(versionName)}</div>
                    </div>
                </div>
                <div class="files-grid">
        `;

        version.files.forEach(file => {
            html += `
                <div class="file-card" onclick="showFileDetails('${file.path}')">
                    <div class="file-name">${file.name}</div>
                    <div class="file-path">${file.path}</div>
                    <div class="file-size">${file.size} - ${file.lines} שורות</div>
                    <div class="status-badge status-${file.status}">${this.getStatusText(file.status)}</div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    /**
     * מחזיר תיאור גרסה
     */
    getVersionDescription(versionName) {
        const descriptions = {
            claude: "גרסאות שפותחו עם Claude AI",
            react: "גרסאות מבוססות React",
            flutter: "גרסאות מבוססות Flutter למובייל",
            research: "קבצי מחקר, ארכיון וגרסאות ישנות",
            archive: "גרסאות בפיתוח וניסויים"
        };
        return descriptions[versionName] || "תיאור לא זמין";
    }

    /**
     * מחזיר טקסט סטטוס
     */
    getStatusText(status) {
        const statusTexts = {
            active: "גרסה פעילה",
            experimental: "ניסיוני",
            archive: "ארכיון"
        };
        return statusTexts[status] || status;
    }
}

// יצירת מופע גלובלי
const versionsManager = new VersionsManager();

// פונקציות עזר לשימוש בדף HTML
function showFileDetails(filePath) {
    alert(`פרטי קובץ: ${filePath}\n\nפונקציונליות זו תתווסף בהמשך...`);
}

function filterByStatus(status) {
    const files = versionsManager.getFilesByStatus(status);
    console.log(`קבצים עם סטטוס ${status}:`, files);
    // כאן תהיה לוגיקה להצגת הקבצים המסוננים
}

function searchVersions(query) {
    const results = versionsManager.searchFiles(query);
    console.log(`תוצאות חיפוש עבור "${query}":`, results);
    // כאן תהיה לוגיקה להצגת תוצאות החיפוש
}

function openFile(filePath) {
    // אם הנתיב מתחיל ב'versions/' – פותח מהשורש
    if (filePath && filePath.startsWith('versions/')) {
        filePath = '../' + filePath;
    }
    window.open(filePath, '_blank');
}

// ייצוא למודולים
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VersionsManager;
} 