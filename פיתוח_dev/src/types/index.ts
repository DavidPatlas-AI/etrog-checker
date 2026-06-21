// User Profile Types
export type UserProfile = 'consumer' | 'merchant' | 'rabbi';

// AI Mode Types
export type AIMode = 'basic' | 'standard' | 'comprehensive';

// Image Quality Types
export type ImageQuality = 'high' | 'medium' | 'low';

// Camera Facing Types
export type CameraFacing = 'environment' | 'user';

// Language Types
export type Language = 'he' | 'en' | 'yi';

// Etrog Status Types
export type EtrogStatus = 'kosher' | 'invalid' | 'uncertain';

// Defect Severity Types
export type DefectSeverity = 'critical' | 'moderate' | 'minor';

// Market Grade Types
export type MarketGrade = 'A+' | 'A' | 'B' | 'C' | 'לא מתאים';

// Primary Category Types
export type PrimaryCategory = 'rishon' | 'sheni' | 'shlishi_square' | 'revi_round' | 'chinuch';

// Export Category Types
export type ExportCategory = 'sorotzkin' | 'store';

// Market Location Types
export type MarketLocation = 'jerusalem' | 'bnei_brak' | 'modiin_illit' | 'netanya' | 'haifa';

// Etrog Category Interfaces
export interface EtrogCategory {
  id: string;
  name: string;
  price: string;
  priceUSD?: string;
  description?: string;
  marketDemand?: string;
  seasonality?: string;
  profitMargin?: string;
}

export interface ExportCategoryData {
  id: string;
  name: string;
  market: string;
  quality: string;
  destinations?: string[];
  requirements?: string;
  shipping?: string;
}

export interface MarketGradeData {
  id: string;
  name: string;
  grade: MarketGrade;
  color: string;
  premium?: string;
}

export interface DefectData {
  name: string;
  severity: DefectSeverity;
  halachic: string;
}

// Measurements Interface
export interface EtrogMeasurements {
  length: string;
  width: string;
  weight: string;
  pitam: string;
  oketz?: string;
}

// Business Insights Interface
export interface BusinessInsights {
  estimatedPrice: number;
  profitMargin: string;
  marketDemand?: string;
  bestSeason?: string;
  competitorPrice?: number;
  recommendation: string;
  legalWarning?: string;
}

// Market Prices Interface
export interface MarketPriceData {
  avg: number;
  trend: string;
  lastWeek: number;
}

export interface LocationData {
  modifier: number;
  name: string;
}

export interface MarketPrices {
  current: Record<PrimaryCategory, MarketPriceData>;
  locations: Record<MarketLocation, LocationData>;
}

// AI Result Interface
export interface AIResult {
  status: EtrogStatus;
  confidence: number;
  variety?: string;
  details: string;
  defects: string[];
  category?: EtrogCategory;
  exportCategory?: ExportCategoryData;
  marketGrade?: MarketGradeData;
  measurements?: EtrogMeasurements;
  halachicNotes?: string;
  businessInsights?: BusinessInsights;
  qualityScore?: number;
  certification?: string;
  origin?: string;
  harvest?: string;
  consumerAdvice?: string;
  analyzerOutputs?: Array<{
    name: string;
    status: EtrogStatus;
    confidence: number;
    notes?: string;
  }>;
}

// History Item Interface
export interface HistoryItem {
  id: number;
  timestamp: Date;
  result: AIResult;
  image: string;
  supplier?: string;
  location?: MarketLocation;
  batch?: number;
}

// Analytics Interface
export interface Analytics {
  totalScanned: number;
  kosherRate: number;
  averageGrade: number;
  monthlyTrends: Array<{
    month: string;
    scanned: number;
    kosherRate: number;
  }>;
}

// Notification Interface
export interface Notification {
  id: number;
  text: string;
  type: 'price' | 'inventory' | 'system';
  time: string;
  read?: boolean;
}

// App State Interface
export interface AppState {
  currentView: string;
  isProcessing: boolean;
  result: AIResult | null;
  capturedImage: string | null;
  cameraStream: MediaStream | null;
  error: string | null;
  processingProgress: number;
  cameraFacing: CameraFacing;
  imageQuality: ImageQuality;
  aiMode: AIMode;
  userProfile: UserProfile;
  language: Language;
  history: HistoryItem[];
  inventory: any[];
  analytics: Analytics;
  notifications: Notification[];
  currentSupplier: string;
  currentLocation: MarketLocation;
  batchMode: boolean;
  currentBatch: HistoryItem[];
  showAdvancedSettings: boolean;
  showHistory: boolean;
  showAnalytics: boolean;
  darkMode: boolean;
  sidebarOpen: boolean;
}

// Camera Constraints Interface
export interface CameraConstraints {
  video: {
    facingMode: CameraFacing;
    width: { ideal: number };
    height: { ideal: number };
    frameRate: { ideal: number; max?: number };
  };
}

// Processing Step Interface
export interface ProcessingStep {
  name: string;
  progress: number;
  delay: number;
}

// Share Data Interface
export interface ShareData {
  title: string;
  text: string;
  url?: string;
}

// Report Interface
export interface Report {
  timestamp: string;
  result: AIResult;
  image: string | null;
  userProfile: UserProfile;
  settings: {
    aiMode: AIMode;
    imageQuality: ImageQuality;
  };
  location?: MarketLocation;
  supplier?: string;
} 