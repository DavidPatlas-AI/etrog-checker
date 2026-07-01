/**
 * Photo Naming Helper for Etrog 3D Photography
 * מערכת עזר לניהול שמות קבצים ותיעוד צילום אתרוגים
 */

export interface EtrogPhotoMetadata {
  etrogId: string;
  date: string;
  photographer: string;
  equipment: {
    camera: string;
    lighting: string;
    turntable: string;
  };
  angles: {
    [key: string]: number;
  };
  totalImages: number;
  processingSoftware?: string;
  halachicStatus: 'pending_review' | 'approved' | 'rejected' | 'needs_consultation';
  notes?: string;
}

export interface PhotoAngle {
  angle: number;
  type: '360_degree' | 'top' | 'side' | 'bottom' | 'diagonal' | 'close_up';
  description: string;
  required: boolean;
}

export class EtrogPhotoManager {
  private etrogId: string;
  private metadata: EtrogPhotoMetadata;
  private photoAngles: PhotoAngle[];
  private initialRequiredCount: number;

  constructor(etrogId: string, photographer: string, equipment: EtrogPhotoMetadata['equipment']) {
    this.etrogId = etrogId;
    this.photoAngles = this.getDefaultPhotoAngles();
    
    this.metadata = {
      etrogId,
      date: new Date().toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0],
      photographer,
      equipment,
      angles: this.calculateRequiredAngles(),
      totalImages: 0,
      halachicStatus: 'pending_review'
    };
    this.initialRequiredCount = this.photoAngles.filter(pa => pa.required).length;
  }

  /**
   * Get default photo angles for complete etrog documentation
   */
  private getDefaultPhotoAngles(): PhotoAngle[] {
    return [
      // 360 degree rotation - every 15 degrees
      ...Array.from({ length: 24 }, (_, i) => ({
        angle: i * 15,
        type: '360_degree' as const,
        description: `צילום 360° - זווית ${i * 15}°`,
        required: true
      })),
      
      // Additional angles
      { angle: 90, type: 'top', description: 'צילום פיטם מלמעלה', required: true },
      { angle: 0, type: 'side', description: 'צילום צד בגובה העיניים', required: true },
      { angle: 270, type: 'bottom', description: 'צילום עוקץ מלמטה', required: true },
      { angle: 45, type: 'diagonal', description: 'צילום אלכסוני לזיהוי חזזית', required: true },
      { angle: 135, type: 'diagonal', description: 'צילום אלכסוני נוסף', required: false },
      { angle: 225, type: 'diagonal', description: 'צילום אלכסוני נוסף', required: false },
      { angle: 315, type: 'diagonal', description: 'צילום אלכסוני נוסף', required: false },
    ];
  }

  /**
   * Calculate required angles for metadata
   */
  private calculateRequiredAngles(): EtrogPhotoMetadata['angles'] {
    const angles: EtrogPhotoMetadata['angles'] = {};
    
    this.photoAngles.forEach(photo => {
      if (!angles[photo.type]) {
        angles[photo.type] = 0;
      }
      angles[photo.type]++;
    });
    
    return angles;
  }

  /**
   * Generate filename for specific angle
   */
  generateFilename(angle: number, extension: string = 'jpg'): string {
    const paddedAngle = angle.toString().padStart(3, '0');
    return `${this.etrogId}_angle_${paddedAngle}.${extension}`;
  }

  /**
   * Generate filename for special angle type
   */
  generateSpecialFilename(type: PhotoAngle['type'], index: number = 1, extension: string = 'jpg'): string {
    const paddedIndex = index.toString().padStart(2, '0');
    return `${this.etrogId}_${type}_${paddedIndex}.${extension}`;
  }

  /**
   * Get next required angle to photograph
   */
  getNextRequiredAngle(): PhotoAngle | null {
    return this.photoAngles.find(photo => photo.required) || null;
  }

  /**
   * Mark angle as photographed
   */
  markAngleAsPhotographed(angle: number): void {
    const photoAngle = this.photoAngles.find(pa => pa.angle === angle);
    if (photoAngle) {
      photoAngle.required = false;
      this.metadata.totalImages++;
    }
  }

  /**
   * Get progress percentage
   */
  getProgressPercentage(): number {
    const completed = this.metadata.totalImages;
    const denominator = this.initialRequiredCount || 1;
    return Math.max(0, Math.min(100, Math.round((completed / denominator) * 100)));
  }

  /**
   * Get remaining angles
   */
  getRemainingAngles(): PhotoAngle[] {
    return this.photoAngles.filter(pa => pa.required);
  }

  /**
   * Add custom angle for specific defect documentation
   */
  addCustomAngle(angle: number, description: string, defectType?: string): void {
    const customAngle: PhotoAngle = {
      angle,
      type: 'close_up',
      description: `${description}${defectType ? ` - ${defectType}` : ''}`,
      required: true
    };
    
    this.photoAngles.push(customAngle);
    this.metadata.angles.close_up = (this.metadata.angles.close_up || 0) + 1;
  }

  /**
   * Generate folder structure
   */
  generateFolderStructure(): string[] {
    return [
      `${this.etrogId}/`,
      `${this.etrogId}/raw/`,
      `${this.etrogId}/processed/`,
      `${this.etrogId}/documentation/`,
      `${this.etrogId}/metadata/`
    ];
  }

  /**
   * Export metadata as JSON
   */
  exportMetadata(): string {
    return JSON.stringify(this.metadata, null, 2);
  }

  /**
   * Generate shooting log
   */
  generateShootingLog(): string {
    const log = [
      `# יומן צילום אתרוג ${this.etrogId}`,
      `תאריך: ${this.metadata.date}`,
      `צלם: ${this.metadata.photographer}`,
      '',
      '## ציוד:',
      `- מצלמה: ${this.metadata.equipment.camera}`,
      `- תאורה: ${this.metadata.equipment.lighting}`,
      `- פלטפורמה: ${this.metadata.equipment.turntable}`,
      '',
      '## זוויות צילום:',
      ...this.photoAngles.map(pa => 
        `- ${pa.angle}°: ${pa.description} ${pa.required ? '(נדרש)' : '(אופציונלי)'}`
      ),
      '',
      `## התקדמות: ${this.getProgressPercentage()}%`,
      `תמונות צולמו: ${this.metadata.totalImages}`,
      `זוויות נותרו: ${this.getRemainingAngles().length}`,
      '',
      '## הערות:',
      this.metadata.notes || 'אין הערות נוספות'
    ].join('\n');
    
    return log;
  }

  /**
   * Generate CSV for batch processing
   */
  generateCSV(): string {
    const headers = ['filename', 'angle', 'type', 'description', 'required', 'status'];
    const rows = this.photoAngles.map(pa => [
      this.generateFilename(pa.angle),
      pa.angle,
      pa.type,
      pa.description,
      pa.required ? 'yes' : 'no',
      pa.required ? 'pending' : 'completed'
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Validate photo set completeness
   */
  validatePhotoSet(): { isValid: boolean; missing: PhotoAngle[]; warnings: string[] } {
    const missing = this.getRemainingAngles();
    const warnings: string[] = [];
    
    // Check minimum requirements
    if (this.metadata.totalImages < 20) {
      warnings.push('מינימום 20 תמונות נדרש למודל תלת-ממדי איכותי');
    }
    
    // Check 360 degree coverage
    const has360Coverage = this.photoAngles.some(pa => pa.type === '360_degree' && !pa.required);
    if (!has360Coverage) {
      warnings.push('צילום 360° לא הושלם');
    }
    
    return {
      isValid: missing.length === 0,
      missing,
      warnings
    };
  }

  /**
   * Get metadata
   */
  getMetadata(): EtrogPhotoMetadata {
    return { ...this.metadata };
  }

  /**
   * Update halachic status
   */
  updateHalachicStatus(status: EtrogPhotoMetadata['halachicStatus'], notes?: string): void {
    this.metadata.halachicStatus = status;
    if (notes) {
      this.metadata.notes = notes;
    }
  }
}

/**
 * Utility functions for batch processing
 */
export class EtrogBatchProcessor {
  /**
   * Process multiple etrogs
   */
  static processBatch(etrogIds: string[], photographer: string, equipment: EtrogPhotoMetadata['equipment']): EtrogPhotoManager[] {
    return etrogIds.map(id => new EtrogPhotoManager(id, photographer, equipment));
  }

  /**
   * Generate batch CSV
   */
  static generateBatchCSV(managers: EtrogPhotoManager[]): string {
    const headers = ['etrog_id', 'total_images', 'progress_percentage', 'halachic_status', 'date'];
    const rows = managers.map(m => [
      m.getMetadata().etrogId,
      m.getMetadata().totalImages,
      m.getProgressPercentage(),
      m.getMetadata().halachicStatus,
      m.getMetadata().date
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Validate entire batch
   */
  static validateBatch(managers: EtrogPhotoManager[]): {
    totalEtrogs: number;
    completedEtrogs: number;
    totalImages: number;
    averageProgress: number;
    issues: string[];
  } {
    const totalEtrogs = managers.length;
    const completedEtrogs = managers.filter(m => m.validatePhotoSet().isValid).length;
    const totalImages = managers.reduce((sum, m) => sum + m.getMetadata().totalImages, 0);
    const averageProgress = managers.reduce((sum, m) => sum + m.getProgressPercentage(), 0) / totalEtrogs;
    
    const issues: string[] = [];
    managers.forEach(m => {
      const validation = m.validatePhotoSet();
      if (!validation.isValid) {
        issues.push(`אתרוג ${m.getMetadata().etrogId}: ${validation.missing.length} זוויות חסרות`);
      }
      validation.warnings.forEach(warning => {
        issues.push(`אתרוג ${m.getMetadata().etrogId}: ${warning}`);
      });
    });
    
    return {
      totalEtrogs,
      completedEtrogs,
      totalImages,
      averageProgress: Math.round(averageProgress),
      issues
    };
  }
}

/**
 * Export functions for use in other modules
 */
export {
  EtrogPhotoManager as PhotoManager,
  EtrogBatchProcessor as BatchProcessor
}; 