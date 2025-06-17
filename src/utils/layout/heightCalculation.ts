import type { ResumeSchema } from '../../types/resume';
import { calculateLayoutMeasurements } from './measurements';

// Shared height calculation interface
export interface ElementHeightEstimate {
  heightPx: number;  // Height in pixels for preview
  heightPt: number;  // Height in points (for precision)
}

// Conversion factor between pixels and points (1.35 px = 1 pt in our system)
const PX_TO_PT_FACTOR = 1 / 1.35;

export class SharedHeightCalculator {
  private layout: ReturnType<typeof calculateLayoutMeasurements>;

  constructor(resume: ResumeSchema) {
    this.layout = calculateLayoutMeasurements(resume.format);
  }

  // Main method to estimate element heights
  estimateElementHeight(elementType: string, content?: any): ElementHeightEstimate {
    const heightPx = this.getHeightInPixels(elementType, content);
    const heightPt = heightPx * PX_TO_PT_FACTOR;

    return {
      heightPx,
      heightPt
    };
  }

  private getHeightInPixels(elementType: string, content?: any): number {
    const baseLineHeight = this.layout.lineHeightPt * 1.35; // Convert to pixels

    switch (elementType) {
      case 'header':
        return 150; // Fixed height for header

      case 'section-title':
        return 30; // Section title height

      case 'summary':
        if (!content) return 80;
        const textLength = typeof content === 'string' ? content.length : 0;
        return 80 + Math.ceil(textLength / 80) * 20; // Base height + lines

      case 'job':
        const baseJobHeight = 80; // Job title and company
        const bulletCount = content?.description?.length || 0;
        const bulletHeight = bulletCount * 30; // 30px per bullet point
        return baseJobHeight + bulletHeight;

      case 'education':
        return 50; // Degree and school info

      case 'skills':
        if (!content?.skills) return 60;
        const skillsText = content.skills.join(' • ');
        const estimatedLines = Math.ceil(skillsText.length / 80);
        return 60 + estimatedLines * 20;

      default:
        return baseLineHeight;
    }
  }

  // Get available content height
  getContentHeight(): { heightPx: number; heightPt: number } {
    return {
      heightPx: this.layout.contentHeightPt * 1.35,
      heightPt: this.layout.contentHeightPt
    };
  }

  // Debug method to compare heights
  debugHeights(elementType: string, content?: any): void {
    const estimate = this.estimateElementHeight(elementType, content);
    console.log(`${elementType}: ${estimate.heightPx}px / ${estimate.heightPt}pt`);
  }
}

// Factory function for easy use
export function createHeightCalculator(resume: ResumeSchema): SharedHeightCalculator {
  return new SharedHeightCalculator(resume);
} 