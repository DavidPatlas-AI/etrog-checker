import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AppState,
  AIResult,
  HistoryItem,
  Notification,
  Analytics,
  UserProfile,
  AIMode,
  ImageQuality,
  CameraFacing,
  Language,
  MarketLocation
} from '@/types';
import { etrogCategories, processingSteps, cameraSettings } from '@/data/etrogData';
import { runAnalyzers, mergeAnalyzerOutputs } from '@/services/analyzers';

interface AppStore extends AppState {
  // Actions
  setCurrentView: (view: string) => void;
  setIsProcessing: (processing: boolean) => void;
  setResult: (result: AIResult | null) => void;
  setCapturedImage: (image: string | null) => void;
  setCameraStream: (stream: MediaStream | null) => void;
  setError: (error: string | null) => void;
  setProcessingProgress: (progress: number) => void;
  setCameraFacing: (facing: CameraFacing) => void;
  setImageQuality: (quality: ImageQuality) => void;
  setAiMode: (mode: AIMode) => void;
  setUserProfile: (profile: UserProfile) => void;
  setLanguage: (lang: Language) => void;
  setCurrentSupplier: (supplier: string) => void;
  setCurrentLocation: (location: MarketLocation) => void;
  setBatchMode: (mode: boolean) => void;
  setDarkMode: (mode: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setShowAdvancedSettings: (show: boolean) => void;

  // Complex actions
  addToHistory: (item: HistoryItem) => void;
  startCamera: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: number) => void;
  updateAnalytics: (result: AIResult) => void;
  resetApp: () => void;
  clearHistory: () => void;

  // AI Simulation
  simulateAIClassification: (imageData: string) => Promise<AIResult>;
}

const initialAnalytics: Analytics = {
  totalScanned: 0,
  kosherRate: 0,
  averageGrade: 0,
  monthlyTrends: []
};

const initialNotifications: Notification[] = [
  { id: 1, text: 'מחירי ראשונים עלו ב-5% השבוע', type: 'price', time: '2 hours ago' },
  { id: 2, text: 'הגיעה משלוח חדש מספק אבני חמד', type: 'inventory', time: '1 day ago' }
];

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentView: 'home',
      isProcessing: false,
      result: null,
      capturedImage: null,
      cameraStream: null,
      error: null,
      processingProgress: 0,
      cameraFacing: 'environment',
      imageQuality: 'high',
      aiMode: 'comprehensive',
      userProfile: 'merchant',
      language: 'he',
      history: [],
      inventory: [],
      analytics: initialAnalytics,
      notifications: initialNotifications,
      currentSupplier: '',
      currentLocation: 'jerusalem',
      batchMode: false,
      currentBatch: [],
      showAdvancedSettings: false,
      showHistory: false,
      showAnalytics: false,
      darkMode: false,
      sidebarOpen: false,

      // Simple setters
      setCurrentView: (view) => set({ currentView: view }),
      setIsProcessing: (processing) => set({ isProcessing: processing }),
      setResult: (result) => set({ result }),
      setCapturedImage: (image) => set({ capturedImage: image }),
      setCameraStream: (stream) => set({ cameraStream: stream }),
      setError: (error) => set({ error }),
      setProcessingProgress: (progress) => set({ processingProgress: progress }),
      setCameraFacing: (facing) => set({ cameraFacing: facing }),
      setImageQuality: (quality) => set({ imageQuality: quality }),
      setAiMode: (mode) => set({ aiMode: mode }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      setLanguage: (lang) => set({ language: lang }),
      setCurrentSupplier: (supplier) => set({ currentSupplier: supplier }),
      setCurrentLocation: (location) => set({ currentLocation: location }),
      setBatchMode: (mode) => set({ batchMode: mode }),
      setDarkMode: (mode) => set({ darkMode: mode }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setShowAdvancedSettings: (show) => set({ showAdvancedSettings: show }),

      // Complex actions
      addToHistory: (item) => {
        const { history } = get();
        const newHistory = [item, ...history.slice(0, 99)]; // Keep last 100
        set({ history: newHistory });
        get().updateAnalytics(item.result);
      },

      addNotification: (notification) => {
        const { notifications } = get();
        set({ notifications: [notification, ...notifications] });
      },

      removeNotification: (id) => {
        const { notifications } = get();
        set({ notifications: notifications.filter(n => n.id !== id) });
      },

      updateAnalytics: (result) => {
        const { analytics } = get();
        const newTotal = analytics.totalScanned + 1;
        const newKosherRate = result.status === 'kosher'
          ? (analytics.kosherRate * analytics.totalScanned + 1) / newTotal
          : (analytics.kosherRate * analytics.totalScanned) / newTotal;

        set({
          analytics: {
            ...analytics,
            totalScanned: newTotal,
            kosherRate: newKosherRate
          }
        });
      },

      resetApp: () => {
        const { cameraStream } = get();
        if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
        }
        set({
          currentView: 'home',
          result: null,
          capturedImage: null,
          cameraStream: null,
          isProcessing: false,
          processingProgress: 0,
          error: null,
          sidebarOpen: false
        });
      },

      clearHistory: () => set({ history: [] }),

      // Camera functions
      startCamera: async () => {
        try {
          const { cameraFacing, imageQuality } = get();
          const quality = cameraSettings[imageQuality];
          const constraints = {
            audio: true,
            video: {
              facingMode: cameraFacing,
              width: { ideal: quality.width },
              height: { ideal: quality.height },
              frameRate: { ideal: quality.frameRate }
            }
          };

          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          set({ cameraStream: stream, currentView: 'camera' });
        } catch (error) {
          set({ error: 'שגיאה בהפעלת המצלמה' });
          throw error;
        }
      },

      // AI Simulation
      simulateAIClassification: async (imageData: string): Promise<AIResult> => {
        const { aiMode, userProfile, currentLocation, currentSupplier } = get();

        // 1) Progress simulation using shared steps
        const steps = processingSteps[aiMode];
        for (const step of steps) {
          set({ processingProgress: step.progress });
          await new Promise(resolve => setTimeout(resolve, step.delay));
        }

        // 2) Run analyzers and merge outputs
        const analyzerOutputs = await runAnalyzers(imageData);
        const { status, confidence } = mergeAnalyzerOutputs(analyzerOutputs);

        // Deterministic seed and image dimensions (for measurements/business cosmetics)
        const hashString = (s: string) => {
          let h = 5381;
          for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
          return Math.abs(h >>> 0);
        };
        const seed = hashString(imageData.slice(0, 512));
        const getImageDimensions = (dataUrl: string) => new Promise<{ width: number; height: number }>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ width: img.width, height: img.height });
          img.onerror = () => resolve({ width: 0, height: 0 });
          img.src = dataUrl;
        });
        const dims = await getImageDimensions(imageData);

        // Choose categories deterministically
        const primaryIdx = seed % etrogCategories.primary.length;
        const exportIdx = seed % etrogCategories.export.length;
        const marketIdx = seed % etrogCategories.market.length;

        const selectedCategory = status === 'kosher' ? etrogCategories.primary[primaryIdx] : undefined;
        const selectedExport = status === 'kosher' ? etrogCategories.export[exportIdx] : undefined;
        const selectedMarket = etrogCategories.market[marketIdx];

        const result: AIResult = {
          status,
          confidence,
          variety: status === 'kosher' ? 'אתרוג מהודר' : status === 'invalid' ? 'אתרוג חשוד' : 'אתרוג – נדרשת בדיקה',
          details: status === 'kosher' ? 'זוהו מאפייני צורה תקינים והערכת איכות טובה' : status === 'invalid' ? 'זוהו חריגות משמעותיות בצורה/איכות' : 'האיכות/המאפיינים אינם מספקים לאבחנה ודאית',
          defects: [],
          category: selectedCategory,
          exportCategory: selectedExport,
          marketGrade: selectedMarket,
          measurements: dims.width && dims.height ? {
            length: `${Math.max(9, Math.min(14, 9 + (seed % 6)))} ס"מ`,
            width: `${Math.max(6, Math.min(9, 6 + (seed % 4)))} ס"מ`,
            weight: `${150 + (seed % 80)} גרם`,
            pitam: status === 'invalid' ? 'חשוד' : 'שלם',
            oketz: status === 'invalid' ? 'עבה' : 'חבוי'
          } : undefined,
          halachicNotes: status === 'invalid' ? 'קיימים ממצאים הפוסלים להלכה' : status === 'uncertain' ? 'מומלץ להתייעץ עם פוסק' : 'כשר למהדרין',
          businessInsights: userProfile === 'merchant' && status !== 'invalid' ? {
            estimatedPrice: selectedCategory ? Math.round((selectedMarket && selectedMarket.premium ? 600 : 500) + (seed % 120)) : 350,
            profitMargin: status === 'kosher' ? '35%' : '20%',
            marketDemand: 'גבוה',
            bestSeason: 'תשרי',
            competitorPrice: 380 + (seed % 70),
            recommendation: status === 'kosher' ? 'מומלץ לרכישה' : 'דורש בדיקה נוספת'
          } : undefined,
          qualityScore: Math.max(60, 95 - (seed % 20)),
          certification: status === 'invalid' ? 'לא מתאים' : 'רבנות/בד"ץ',
          origin: 'ישראל',
          harvest: '2024-09-20',
          consumerAdvice: userProfile !== 'merchant' ? (status === 'kosher' ? 'כדאי לקנות' : status === 'invalid' ? 'לא מומלץ' : 'בדיקת רב מומלצת') : undefined,
          analyzerOutputs
        };

        // 3) Persist to history
        const historyItem: HistoryItem = {
          id: Date.now(),
          timestamp: new Date(),
          result,
          image: imageData,
          supplier: currentSupplier,
          location: currentLocation
        };
        get().addToHistory(historyItem);

        return result;
      }
    }),
    {
      name: 'etrog-app-storage',
      partialize: (state) => ({
        userProfile: state.userProfile,
        language: state.language,
        aiMode: state.aiMode,
        imageQuality: state.imageQuality,
        darkMode: state.darkMode,
        analytics: state.analytics,
        currentSupplier: state.currentSupplier,
        currentLocation: state.currentLocation
      })
    }
  )
); 