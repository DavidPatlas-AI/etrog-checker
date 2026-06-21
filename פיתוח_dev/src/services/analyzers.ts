import { AIResult, EtrogStatus } from '@/types';

export interface AnalyzerOutput {
  name: string;
  status: EtrogStatus;
  confidence: number;
  notes?: string;
}

export interface Analyzer {
  name: string;
  analyze: (imageDataUrl: string) => Promise<AnalyzerOutput>;
}

// Heuristic analyzer (based on size/aspect)
const heuristicAnalyzer: Analyzer = {
  name: 'Heuristic',
  analyze: async (imageDataUrl: string): Promise<AnalyzerOutput> => {
    const hashString = (s: string) => {
      let h = 5381;
      for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
      return Math.abs(h >>> 0);
    };
    const getImageDimensions = (dataUrl: string) => new Promise<{ width: number; height: number }>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => resolve({ width: 0, height: 0 });
      img.src = dataUrl;
    });

    const approxBytes = Math.floor((imageDataUrl.length - imageDataUrl.indexOf(',') - 1) * 0.75);
    const seed = hashString(imageDataUrl.slice(0, 512));
    const dims = await getImageDimensions(imageDataUrl);
    const aspect = dims.height > 0 ? dims.width / dims.height : 1;
    const largeImage = approxBytes > 150_000;
    const tallShape = aspect < 0.8;
    const wideShape = aspect > 1.6;

    let status: EtrogStatus = 'kosher';
    let confidence = 0.85;
    let notes: string | undefined;

    if (!dims.width || !dims.height) {
      status = 'uncertain';
      confidence = 0.5;
      notes = 'לא ניתן לאמוד ממדים';
    } else if (tallShape || wideShape) {
      status = seed % 3 === 0 ? 'invalid' : 'uncertain';
      confidence = status === 'invalid' ? 0.9 : 0.7;
      notes = status === 'invalid' ? 'צורה גיאומטרית חריגה' : 'יחס ממדים חריג';
    } else if (!largeImage) {
      status = 'uncertain';
      confidence = 0.65;
      notes = 'איכות תמונה נמוכה';
    } else {
      status = 'kosher';
      confidence = 0.9 - (seed % 10) / 100;
      notes = 'מאפייני צורה תקינים';
    }

    return { name: 'Heuristic', status, confidence, notes };
  }
};

// Simple quality analyzer (brightness/contrast/sharpness proxy)
const qualityAnalyzer: Analyzer = {
  name: 'Quality',
  analyze: async (imageDataUrl: string): Promise<AnalyzerOutput> => {
    const img = new Image();
    const dims = await new Promise<{ w: number; h: number }>((resolve) => {
      img.onload = () => resolve({ w: img.width, h: img.height });
      img.onerror = () => resolve({ w: 0, h: 0 });
      img.src = imageDataUrl;
    });
    if (!dims.w || !dims.h) {
      return { name: 'Quality', status: 'uncertain', confidence: 0.5, notes: 'תמונה לא נטענה' };
    }
    const canvas = document.createElement('canvas');
    canvas.width = Math.min(256, dims.w);
    canvas.height = Math.min(256, dims.h);
    const ctx = canvas.getContext('2d');
    if (!ctx) return { name: 'Quality', status: 'uncertain', confidence: 0.5, notes: 'קנבס לא זמין' };
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let sum = 0, sumSq = 0, n = 0;
    for (let i = 0; i < data.length; i += 4) {
      const y = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      sum += y; sumSq += y * y; n++;
    }
    const mean = sum / n;
    const variance = Math.max(0, sumSq / n - mean * mean);
    const contrast = Math.sqrt(variance);
    // Heuristic thresholds
    if (contrast < 20 || mean < 30 || mean > 220) {
      return { name: 'Quality', status: 'uncertain', confidence: 0.6, notes: 'ניגודיות/חשיפה בעייתית' };
    }
    return { name: 'Quality', status: 'kosher', confidence: 0.8, notes: 'איכות תמונה סבירה' };
  }
};

export const analyzers: Analyzer[] = [heuristicAnalyzer, qualityAnalyzer];

export async function runAnalyzers(imageDataUrl: string): Promise<AnalyzerOutput[]> {
  const outputs: AnalyzerOutput[] = [];
  for (const a of analyzers) {
    try {
      const out = await a.analyze(imageDataUrl);
      outputs.push(out);
    } catch {
      outputs.push({ name: a.name, status: 'uncertain', confidence: 0.5, notes: 'שגיאה במפענח' });
    }
  }
  return outputs;
}

export function mergeAnalyzerOutputs(outputs: AnalyzerOutput[]): Pick<AIResult, 'status' | 'confidence'> {
  // Priority: invalid > uncertain > kosher
  if (outputs.some(o => o.status === 'invalid')) {
    const conf = Math.max(...outputs.filter(o => o.status === 'invalid').map(o => o.confidence));
    return { status: 'invalid', confidence: conf };
  }
  if (outputs.some(o => o.status === 'uncertain')) {
    const conf = Math.max(...outputs.filter(o => o.status === 'uncertain').map(o => o.confidence));
    return { status: 'uncertain', confidence: conf };
  }
  // All kosher: average confidence
  const kos = outputs.filter(o => o.status === 'kosher');
  const conf = kos.length ? kos.reduce((s, o) => s + o.confidence, 0) / kos.length : 0.8;
  return { status: 'kosher', confidence: conf };
}


