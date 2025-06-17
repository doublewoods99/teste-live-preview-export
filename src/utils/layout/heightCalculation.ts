import type { ResumeSchema } from '../../types/resume';
import { calculateLayoutMeasurements, PAGE } from './measurements';

export interface ElementMeasurement {
  widthPt: number;
  heightPt: number;
  heightPx: number;
}

// Use proper DPI conversion factor from measurements utility
const PX_TO_PT_FACTOR = 1 / (PAGE.toPx(1));

export class SharedHeightCalculator {
  private layout: ReturnType<typeof calculateLayoutMeasurements>;

  constructor(resume: ResumeSchema) {
    this.layout = calculateLayoutMeasurements(resume.format);
  }

  public convertPixelsToPoints(heightPx: number): number {
    const heightPt = heightPx * PX_TO_PT_FACTOR;
    return heightPt;
  }

  public estimateElementHeight(elementType: string, content?: any): ElementMeasurement {
    const heightPx = this.getHeightInPixels(elementType, content);
    return {
      widthPt: this.layout.contentWidthPt,
      heightPt: this.convertPixelsToPoints(heightPx),
      heightPx
    };
  }

  private getHeightInPixels(elementType: string, content?: any): number {
    const baseLineHeight = PAGE.toPx(this.layout.lineHeightPt); // Convert to pixels using proper DPI

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

  public getPageDimensions(): { widthPx: number; heightPx: number } {
    return {
      widthPx: PAGE.toPx(this.layout.pageWidthPt),
      heightPx: PAGE.toPx(this.layout.contentHeightPt),
    };
  }
}

// Factory function for easy use
export function createHeightCalculator(resume: ResumeSchema): SharedHeightCalculator {
  return new SharedHeightCalculator(resume);
} 