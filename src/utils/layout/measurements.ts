import type { ResumeFormat } from '../../types/resume';

// PRECISE PAGE CONSTANTS - Single source of truth with exact decimal values
export const PAGE = {
  A4: {
    widthPt: 595.28,   // A4 exact in points
    heightPt: 841.89,  // A4 exact in points
  },
  Letter: {
    widthPt: 612,      // US Letter exact
    heightPt: 792,     // US Letter exact
  },
  // Precise DPI conversion functions
  toPx: (pt: number) => pt * 96 / 72,   // 96-DPI preview conversion
  toPt: (px: number) => px * 72 / 96,   // Pixels to points conversion
} as const;

// PRECISE FONT MAPPING for web rendering
export const FONT_MAPPING = {
  'Arial': {
    css: 'Arial, sans-serif'
  },
  'Georgia': {
    css: 'Georgia, serif'
  },
  'Times New Roman': {
    css: '"Times New Roman", serif'
  }
} as const;

// PRECISE MEASUREMENT INTERFACE - All in points for consistency
export interface LayoutMeasurements {
  // Page dimensions (points)
  pageWidthPt: number;
  pageHeightPt: number;
  contentWidthPt: number;
  contentHeightPt: number;
  
  // Margins (points)
  marginTopPt: number;
  marginRightPt: number;
  marginBottomPt: number;
  marginLeftPt: number;
  
  // Typography (points)
  fontSizePt: number;
  lineHeightPt: number;
  
  // Spacing (points)
  sectionSpacingPt: number;
  itemSpacingPt: number;
  
  // Pixel equivalents for HTML rendering (converted from points)
  pageWidthPx: number;
  pageHeightPx: number;
  contentWidthPx: number;
  contentHeightPx: number;
  marginTopPx: number;
  marginRightPx: number;
  marginBottomPx: number;
  marginLeftPx: number;
  fontSizePx: number;
  lineHeightPx: number;
  sectionSpacingPx: number;
  itemSpacingPx: number;
}

export function calculateLayoutMeasurements(format: ResumeFormat): LayoutMeasurements {
  const pageDimensions = PAGE[format.pageSize];
  
  // Calculate content area in points
  const contentWidthPt = pageDimensions.widthPt - format.margins.left - format.margins.right;
  const contentHeightPt = pageDimensions.heightPt - format.margins.top - format.margins.bottom;
  
  // Calculate line height in points (fontSize * lineHeight ratio)
  const lineHeightPt = format.fontSize * format.lineHeight;
  
  return {
    // Page dimensions (points) - source of truth
    pageWidthPt: pageDimensions.widthPt,
    pageHeightPt: pageDimensions.heightPt,
    contentWidthPt,
    contentHeightPt,
    
    // Margins (points) - source of truth
    marginTopPt: format.margins.top,
    marginRightPt: format.margins.right,
    marginBottomPt: format.margins.bottom,
    marginLeftPt: format.margins.left,
    
    // Typography (points) - source of truth
    fontSizePt: format.fontSize,
    lineHeightPt,
    
    // Spacing (points) - source of truth
    sectionSpacingPt: format.sectionSpacing,
    itemSpacingPt: format.itemSpacing,
    
    // Pixel equivalents for HTML rendering (converted)
    pageWidthPx: PAGE.toPx(pageDimensions.widthPt),
    pageHeightPx: PAGE.toPx(pageDimensions.heightPt),
    contentWidthPx: PAGE.toPx(contentWidthPt),
    contentHeightPx: PAGE.toPx(contentHeightPt),
    marginTopPx: PAGE.toPx(format.margins.top),
    marginRightPx: PAGE.toPx(format.margins.right),
    marginBottomPx: PAGE.toPx(format.margins.bottom),
    marginLeftPx: PAGE.toPx(format.margins.left),
    fontSizePx: PAGE.toPx(format.fontSize),
    lineHeightPx: PAGE.toPx(lineHeightPt),
    sectionSpacingPx: PAGE.toPx(format.sectionSpacing),
    itemSpacingPx: PAGE.toPx(format.itemSpacing),
  };
}

// SHARED TEXT MEASUREMENT UTILITIES
export interface TextMeasurements {
  widthPt: number;
  heightPt: number;
  lines: string[];
}

export function measureTextPrecise(
  text: string, 
  fontSizePt: number, 
  fontFamily: string,
  maxWidthPt: number,
  lineHeightPt: number
): TextMeasurements {
  // Create a temporary canvas for precise text measurement
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Set font with exact pixel size converted from points
  const fontSizePx = PAGE.toPx(fontSizePt);
  const fontMapping = FONT_MAPPING[fontFamily as keyof typeof FONT_MAPPING];
  ctx.font = `${fontSizePx}px ${fontMapping?.css || fontFamily}`;
  
  // Split text into lines that fit within maxWidth
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidthPx = ctx.measureText(testLine).width;
    const testWidthPt = PAGE.toPt(testWidthPx);
    
    if (testWidthPt <= maxWidthPt || !currentLine) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  // Calculate total dimensions in points
  const maxLineWidthPx = Math.max(...lines.map(line => ctx.measureText(line).width));
  const maxLineWidthPt = PAGE.toPt(maxLineWidthPx);
  const totalHeightPt = lines.length * lineHeightPt;
  
  return {
    widthPt: maxLineWidthPt,
    heightPt: totalHeightPt,
    lines
  };
}


// DEBUG UTILITIES
export function createPrecisionOverlay(previewElement: HTMLElement, layout: LayoutMeasurements): HTMLElement {
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.border = '2px solid red';
  overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.05)';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '1000';
  
  // Add content area indicator
  const contentArea = document.createElement('div');
  contentArea.style.position = 'absolute';
  contentArea.style.top = `${layout.marginTopPx}px`;
  contentArea.style.left = `${layout.marginLeftPx}px`;
  contentArea.style.width = `${layout.contentWidthPx}px`;
  contentArea.style.height = `${layout.contentHeightPx}px`;
  contentArea.style.border = '1px dashed blue';
  contentArea.style.backgroundColor = 'rgba(0, 0, 255, 0.03)';
  
  overlay.appendChild(contentArea);
  
  previewElement.style.position = 'relative';
  previewElement.appendChild(overlay);
  
  return overlay;
}

// ENHANCED DEBUG UTILITIES
export interface DebugMeasurements {
  elementId: string;
  previewDimensions: { x: number; y: number; width: number; height: number };
  calculatedDimensions: { x: number; y: number; width: number; height: number };
  differences: { dx: number; dy: number; dw: number; dh: number };
}

export function createAdvancedDebugOverlay(previewElement: HTMLElement, layout: LayoutMeasurements): HTMLElement {
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '1000';
  overlay.style.fontFamily = 'monospace';
  overlay.style.fontSize = '10px';
  
  // Page boundary (red)
  const pageBorder = document.createElement('div');
  pageBorder.style.position = 'absolute';
  pageBorder.style.top = '0';
  pageBorder.style.left = '0';
  pageBorder.style.width = '100%';
  pageBorder.style.height = '100%';
  pageBorder.style.border = '2px solid #ef4444';
  pageBorder.style.backgroundColor = 'rgba(239, 68, 68, 0.02)';
  overlay.appendChild(pageBorder);
  
  // Content area (blue dashed)
  const contentArea = document.createElement('div');
  contentArea.style.position = 'absolute';
  contentArea.style.top = `${layout.marginTopPx}px`;
  contentArea.style.left = `${layout.marginLeftPx}px`;
  contentArea.style.width = `${layout.contentWidthPx}px`;
  contentArea.style.height = `${layout.contentHeightPx}px`;
  contentArea.style.border = '1px dashed #3b82f6';
  contentArea.style.backgroundColor = 'rgba(59, 130, 246, 0.03)';
  overlay.appendChild(contentArea);
  
  // Margin indicators with measurements
  const createMarginIndicator = (side: string, value: number, color: string) => {
    const indicator = document.createElement('div');
    indicator.style.position = 'absolute';
    indicator.style.backgroundColor = color;
    indicator.style.color = 'white';
    indicator.style.padding = '2px 4px';
    indicator.style.fontSize = '9px';
    indicator.style.fontWeight = 'bold';
    indicator.style.borderRadius = '2px';
    indicator.textContent = `${value}pt`;
    
    switch(side) {
      case 'top':
        indicator.style.top = '2px';
        indicator.style.left = '50%';
        indicator.style.transform = 'translateX(-50%)';
        break;
      case 'right':
        indicator.style.right = '2px';
        indicator.style.top = '50%';
        indicator.style.transform = 'translateY(-50%)';
        break;
      case 'bottom':
        indicator.style.bottom = '2px';
        indicator.style.left = '50%';
        indicator.style.transform = 'translateX(-50%)';
        break;
      case 'left':
        indicator.style.left = '2px';
        indicator.style.top = '50%';
        indicator.style.transform = 'translateY(-50%)';
        break;
    }
    
    return indicator;
  };
  
  overlay.appendChild(createMarginIndicator('top', layout.marginTopPt, '#ef4444'));
  overlay.appendChild(createMarginIndicator('right', layout.marginRightPt, '#f59e0b'));
  overlay.appendChild(createMarginIndicator('bottom', layout.marginBottomPt, '#10b981'));
  overlay.appendChild(createMarginIndicator('left', layout.marginLeftPt, '#8b5cf6'));
  
  // Grid lines for better alignment visualization
  const createGridLines = () => {
    const gridContainer = document.createElement('div');
    gridContainer.style.position = 'absolute';
    gridContainer.style.top = `${layout.marginTopPx}px`;
    gridContainer.style.left = `${layout.marginLeftPx}px`;
    gridContainer.style.width = `${layout.contentWidthPx}px`;
    gridContainer.style.height = `${layout.contentHeightPx}px`;
    gridContainer.style.opacity = '0.3';
    
    // Horizontal lines every 20px
    for (let y = 0; y < layout.contentHeightPx; y += 20) {
      const line = document.createElement('div');
      line.style.position = 'absolute';
      line.style.top = `${y}px`;
      line.style.left = '0';
      line.style.width = '100%';
      line.style.height = '1px';
      line.style.backgroundColor = '#6b7280';
      gridContainer.appendChild(line);
    }
    
    // Vertical lines every 50px
    for (let x = 0; x < layout.contentWidthPx; x += 50) {
      const line = document.createElement('div');
      line.style.position = 'absolute';
      line.style.top = '0';
      line.style.left = `${x}px`;
      line.style.width = '1px';
      line.style.height = '100%';
      line.style.backgroundColor = '#6b7280';
      gridContainer.appendChild(line);
    }
    
    return gridContainer;
  };
  
  overlay.appendChild(createGridLines());
  
  // Measurement info panel
  const infoPanel = document.createElement('div');
  infoPanel.style.position = 'absolute';
  infoPanel.style.top = '10px';
  infoPanel.style.right = '10px';
  infoPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  infoPanel.style.color = 'white';
  infoPanel.style.padding = '8px';
  infoPanel.style.borderRadius = '4px';
  infoPanel.style.fontSize = '10px';
  infoPanel.style.lineHeight = '1.3';
  infoPanel.style.maxWidth = '200px';
  
  infoPanel.innerHTML = `
    <div style="color: #fbbf24; font-weight: bold; margin-bottom: 4px;">📐 PRECISION DEBUG</div>
    <div><strong>Page:</strong> ${layout.pageWidthPt}×${layout.pageHeightPt}pt</div>
    <div><strong>Content:</strong> ${layout.contentWidthPt.toFixed(1)}×${layout.contentHeightPt.toFixed(1)}pt</div>
    <div><strong>Font:</strong> ${layout.fontSizePt}pt (${layout.fontSizePx.toFixed(1)}px)</div>
    <div><strong>Line Height:</strong> ${layout.lineHeightPt.toFixed(1)}pt</div>
    <div style="margin-top: 6px; color: #94a3b8;">
      <div><strong>Margins (pt):</strong></div>
      <div>T:${layout.marginTopPt} R:${layout.marginRightPt}</div>
      <div>B:${layout.marginBottomPt} L:${layout.marginLeftPt}</div>
    </div>
    <div style="margin-top: 6px; color: #f87171;">
      <strong>96 DPI Conversion:</strong><br>
      1pt = ${(96/72).toFixed(3)}px
    </div>
  `;
  
  overlay.appendChild(infoPanel);
  
  previewElement.style.position = 'relative';
  previewElement.appendChild(overlay);
  
  return overlay;
}

// LINE BOX DEBUGGING - Shows exact text line boundaries
export function createLineBoxOverlay(textElement: HTMLElement, text: string, layout: LayoutMeasurements): HTMLElement {
  const lines = text.split('\n');
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '999';
  
  lines.forEach((_line, index) => {
    const lineBox = document.createElement('div');
    lineBox.style.position = 'absolute';
    lineBox.style.top = `${index * layout.lineHeightPx}px`;
    lineBox.style.left = '0';
    lineBox.style.width = '100%';
    lineBox.style.height = `${layout.lineHeightPx}px`;
    lineBox.style.border = '1px solid rgba(255, 0, 255, 0.5)';
    lineBox.style.backgroundColor = 'rgba(255, 0, 255, 0.05)';
    
    // Add line number
    const lineNumber = document.createElement('span');
    lineNumber.style.position = 'absolute';
    lineNumber.style.right = '2px';
    lineNumber.style.top = '1px';
    lineNumber.style.fontSize = '8px';
    lineNumber.style.color = '#ec4899';
    lineNumber.style.fontWeight = 'bold';
    lineNumber.textContent = `L${index + 1}`;
    lineBox.appendChild(lineNumber);
    
    overlay.appendChild(lineBox);
  });
  
  textElement.style.position = 'relative';
  textElement.appendChild(overlay);
  
  return overlay;
}



// REGRESSION TESTING SNAPSHOT
export function captureLayoutSnapshot(layout: LayoutMeasurements): string {
  const snapshot = {
    pageSize: `${layout.pageWidthPt}×${layout.pageHeightPt}`,
    margins: `${layout.marginTopPt},${layout.marginRightPt},${layout.marginBottomPt},${layout.marginLeftPt}`,
    typography: `${layout.fontSizePt}pt/${layout.lineHeightPt}pt`,
    spacing: `section:${layout.sectionSpacingPt},item:${layout.itemSpacingPt}`,
    timestamp: new Date().toISOString()
  };
  
  return JSON.stringify(snapshot, null, 2);
} 