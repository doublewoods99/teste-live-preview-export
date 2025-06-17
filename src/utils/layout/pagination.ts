import { calculateLayoutMeasurements } from './measurements';
import type { ResumeFormat } from '../../types/resume';

// Enhanced content measurement for accurate pagination
export interface ContentMeasurement {
  height: number;
  element: HTMLElement;
}

export interface PageBreakInfo {
  shouldBreak: boolean;
  remainingHeight: number;
}

export class PaginationCalculator {
  private layout: ReturnType<typeof calculateLayoutMeasurements>;
  private contentHeightPx: number;
  private measureContainer: HTMLElement | null = null;

  constructor(format: ResumeFormat) {
    this.layout = calculateLayoutMeasurements(format);
    // Convert content height from points to pixels (using 1.35 conversion factor)
    this.contentHeightPx = this.layout.contentHeightPt * 1.35;
    this.setupMeasureContainer();
  }

  private setupMeasureContainer(): void {
    if (typeof document === 'undefined') return;
    
    this.measureContainer = document.createElement('div');
    this.measureContainer.style.position = 'absolute';
    this.measureContainer.style.visibility = 'hidden';
    this.measureContainer.style.top = '-9999px';
    this.measureContainer.style.left = '-9999px';
    this.measureContainer.style.width = `${this.layout.contentWidthPt * 1.35}px`;
    this.measureContainer.style.fontFamily = this.getFontFamily();
    this.measureContainer.style.fontSize = `${this.layout.fontSizePt * 1.35}px`;
    this.measureContainer.style.lineHeight = '1.4';
    
    document.body.appendChild(this.measureContainer);
  }

  private getFontFamily(): string {
    const format = this.layout;
    // This should be derived from the format, but we'll use a sensible default
    return 'Arial, sans-serif';
  }

  public measureElement(element: HTMLElement): ContentMeasurement {
    if (!this.measureContainer) {
      return { height: 100, element }; // Fallback
    }

    const clone = element.cloneNode(true) as HTMLElement;
    this.measureContainer.innerHTML = '';
    this.measureContainer.appendChild(clone);
    
    const height = this.measureContainer.offsetHeight;
    
    return { height, element };
  }

  public checkPageBreak(currentHeight: number, elementHeight: number): PageBreakInfo {
    const totalHeight = currentHeight + elementHeight;
    const shouldBreak = totalHeight > this.contentHeightPx;
    const remainingHeight = this.contentHeightPx - currentHeight;
    
    return {
      shouldBreak: shouldBreak && currentHeight > 0, // Don't break if it's the first element
      remainingHeight: Math.max(0, remainingHeight)
    };
  }

  public getContentHeight(): number {
    return this.contentHeightPx;
  }

  public destroy(): void {
    if (this.measureContainer && this.measureContainer.parentNode) {
      this.measureContainer.parentNode.removeChild(this.measureContainer);
      this.measureContainer = null;
    }
  }

  // Estimate heights for common resume elements (used as fallback)
  public estimateElementHeight(elementType: 'header' | 'section-title' | 'job' | 'education' | 'skills', content?: any): number {
    const baseLineHeight = this.layout.lineHeightPt * 1.35;
    
    switch (elementType) {
      case 'header':
        return baseLineHeight * 4; // Name, title, contact info
      
      case 'section-title':
        return baseLineHeight * 1.5; // Title with spacing
      
      case 'job':
        const bulletPoints = content?.description?.length || 0;
        return baseLineHeight * (2 + bulletPoints); // Title, details, bullet points
      
      case 'education':
        return baseLineHeight * 2; // Degree and school info
      
      case 'skills':
        const skillsLength = content?.skills?.join(' • ')?.length || 0;
        const estimatedLines = Math.ceil(skillsLength / 80); // Rough chars per line
        return baseLineHeight * (1 + estimatedLines);
      
      default:
        return baseLineHeight;
    }
  }
}

// Page size constants in pixels (converted from points)
export const PAGE_SIZES = {
  A4: {
    widthPx: 595.28 * 1.35,
    heightPx: 841.89 * 1.35,
  },
  Letter: {
    widthPx: 612 * 1.35,
    heightPx: 792 * 1.35,
  },
} as const;

// Utility function to create a page break detector
export function createPageBreakDetector(format: ResumeFormat) {
  return new PaginationCalculator(format);
} 