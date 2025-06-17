// HTML/CSS Extractor for Preview → Puppeteer approach
// Step 1: Capture the exact rendered HTML and CSS from the Preview component

export interface ExtractedContent {
  html: string;
  css: string;
  completeDocument: string;
  pages: ExtractedPage[];
}

interface ExtractedPage {
  html: string;
  pageNumber: number;
}

export function extractPreviewContent(previewElement: HTMLElement, pageFormat: 'A4' | 'Letter' = 'A4'): ExtractedContent {
  if (!previewElement) {
    throw new Error('Preview element not found');
  }

  // Add template validation to prevent wrong template exports
  console.log('🔍 Starting HTML extraction for PDF export...');
  console.log('📋 Preview element:', {
    childCount: previewElement.children.length,
    textLength: previewElement.textContent?.length || 0,
    hasContent: !!previewElement.textContent?.trim()
  });

  // Wait a moment to ensure preview is fully rendered
  // This helps prevent race conditions with template switching
  const extractionStart = performance.now();

  // Extract individual pages from the preview
  const extractedPages = extractIndividualPages(previewElement);
  
  if (extractedPages.length === 0) {
    throw new Error('No valid content found in preview for PDF export. Please ensure preview is loaded correctly.');
  }

  // Validate template content exists
  const totalContentLength = extractedPages.reduce((sum, page) => sum + (page.html.length || 0), 0);
  if (totalContentLength < 100) {
    console.warn('⚠️ Very little content extracted - possible template loading issue');
  }

  // Get all the CSS from the document's stylesheets
  const originalCSS = extractOriginalCSS();

  // Create a complete HTML document that preserves the exact Preview styling
  const completeDocument = createOptimizedHTMLDocument(extractedPages, originalCSS, pageFormat);

  const extractionTime = performance.now() - extractionStart;
  console.log(`✅ HTML extraction completed in ${extractionTime.toFixed(2)}ms:`, {
    pages: extractedPages.length,
    htmlLength: completeDocument.length,
    cssRules: originalCSS.split('\n').length
  });

  return {
    html: extractedPages.map(page => page.html).join('\n'),
    css: originalCSS,
    completeDocument,
    pages: extractedPages
  };
}

function extractIndividualPages(previewElement: HTMLElement): ExtractedPage[] {
  console.log(`🔍 Starting extraction from simplified preview element`);
  
  // Since we simplified the structure, just extract the template content directly
  const hasContent = previewElement.textContent && previewElement.textContent.trim().length > 50;
  
  if (!hasContent) {
    console.error('❌ No meaningful content found in preview element');
    console.log('Preview element details:', {
      tagName: previewElement.tagName,
      children: previewElement.children.length,
      textLength: previewElement.textContent?.length || 0,
      hasDataAttribute: previewElement.hasAttribute('data-template-preview')
    });
    return [];
  }
  
  // Template detection for debugging
  const previewContent = previewElement.textContent || '';
  console.log('🎨 Content found:', {
    contentLength: previewContent.length,
    contentSample: previewContent.substring(0, 100) + '...',
    hasTemplateData: previewElement.hasAttribute('data-template-preview')
  });
  
  // Clone the preview element and clean it up for PDF
  const clonedElement = previewElement.cloneNode(true) as HTMLElement;
  
  // Only remove preview-specific styling, preserve template styles
  clonedElement.style.transform = '';
  clonedElement.style.boxShadow = 'none';
  clonedElement.style.overflow = 'visible';
  clonedElement.style.margin = '0';
  clonedElement.style.padding = '0';
  
  // Remove the data attribute as it's not needed in PDF
  clonedElement.removeAttribute('data-template-preview');
  
  // Preserve all inline styles by ensuring they're not stripped
  // The templates use inline styles for decorative elements
  const allElements = clonedElement.querySelectorAll('*');
  allElements.forEach(element => {
    const htmlElement = element as HTMLElement;
    // Don't modify inline styles - these contain the template's decorative styling
    // Only remove specific preview-related properties if they exist
    if (htmlElement.style.transform) htmlElement.style.transform = '';
    if (htmlElement.style.boxShadow && htmlElement.style.boxShadow.includes('rgba(0, 0, 0, 0.1)')) {
      htmlElement.style.boxShadow = 'none';
    }
  });
  
  const extractedPages: ExtractedPage[] = [{
    html: clonedElement.outerHTML,
    pageNumber: 1
  }];
  
  console.log(`✅ Extracted simplified content (${clonedElement.textContent?.length} characters)`);
  console.log(`📋 Preserved inline styles for template decorative elements`);
  
  return extractedPages;
}

function extractOriginalCSS(): string {
  const cssRules: string[] = [];
  
  // Extract CSS from all stylesheets in the document
  for (let i = 0; i < document.styleSheets.length; i++) {
    try {
      const styleSheet = document.styleSheets[i];
      if (styleSheet.cssRules) {
        for (let j = 0; j < styleSheet.cssRules.length; j++) {
          cssRules.push(styleSheet.cssRules[j].cssText);
        }
      }
    } catch (e) {
      // Skip stylesheets that can't be accessed (CORS issues)
      console.log('Skipping stylesheet due to CORS:', e);
    }
  }

  return cssRules.join('\n');
}

function createOptimizedHTMLDocument(pages: ExtractedPage[], css: string, pageFormat: 'A4' | 'Letter' = 'A4'): string {
  if (pages.length === 0) {
    return createSimpleHTMLDocument('', css);
  }

  // Create clean page structure for PDF - each page should fit exactly on PDF page
  const combinedHTML = pages.map((page, index) => {
    // For single page, don't add page break classes
    // For multi-page, add page break classes except for the last page
    const pageBreakClass = pages.length > 1 && index < pages.length - 1 ? 'pdf-page-break' : '';
    
    return `<div class="pdf-page ${pageBreakClass}" data-page="${index + 1}">
      ${page.html}
    </div>`;
  }).join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume PDF Export</title>
  <style>
    /* Preserve all original CSS from the application */
    ${css}
    
    /* PDF-specific optimizations for exact preview matching */
    * {
      box-sizing: border-box;
    }
    
    /* Force consistent fonts between preview and PDF */
    @font-face {
      font-family: 'Arial';
      src: local('Arial'), local('ArialMT'), 
           local('Helvetica'), local('HelveticaNeue');
      font-display: swap;
    }
    
    @font-face {
      font-family: 'Times';
      src: local('Times'), local('Times New Roman'), 
           local('TimesNewRomanPSMT'), local('serif');
      font-display: swap;
    }
    
    body {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      display: block !important;
      /* Force consistent font metrics */
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif !important;
      font-size: 11pt !important;
      line-height: 1.4 !important;
      /* Ensure consistent font rendering between preview and PDF */
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
      /* Force consistent font rendering with exact metrics */
      text-rendering: optimizeLegibility !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      /* Prevent font scaling */
      -webkit-text-size-adjust: 100% !important;
      -ms-text-size-adjust: 100% !important;
    }
    
    /* PDF page settings - no margins since template handles them */
    @page {
      size: ${pageFormat};
      margin: 0;
      /* Force consistent DPI */
      -webkit-print-color-adjust: exact;
    }
    
    /* Page break controls for PDF */
    .pdf-page {
      width: 100%;
      background: white;
      position: relative;
      /* Ensure content fits properly */
      box-sizing: border-box;
      /* Force exact font metrics matching preview */
      font-synthesis: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    .pdf-page-break {
      page-break-after: always !important;
      break-after: page !important;
    }
    
    /* Only remove preview-specific styling, preserve template decorative elements */
    .pdf-page[data-template-preview] {
      box-shadow: none !important;
      transform: none !important;
      /* Don't remove borders - those are template decorative elements! */
    }
    
    /* Force consistent font metrics across all text elements */
    .pdf-page *,
    .pdf-page *:before,
    .pdf-page *:after {
      font-synthesis: none !important;
      text-rendering: optimizeLegibility !important;
      /* Prevent any browser font adjustments */
      font-size-adjust: none !important;
      font-stretch: normal !important;
      font-variant: normal !important;
    }
    
    /* Print media query for additional PDF optimizations */
    @media print {
      body {
        margin: 0 !important;
        padding: 0 !important;
      }
      
      .pdf-page {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: 100vh !important;
      }
      
      /* Ensure no print scaling */
      @page {
        margin: 0;
        size: ${pageFormat};
      }
    }
  </style>
</head>
<body>
  ${combinedHTML}
</body>
</html>`;
}

function createSimpleHTMLDocument(html: string, css: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume Preview Extract</title>
  <style>
    /* Preserve all original CSS from the application */
    ${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
}

export function downloadExtractedContent(content: ExtractedContent, filename: string = 'extracted-preview.html') {
  const blob = new Blob([content.completeDocument], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function logExtractedContent(content: ExtractedContent) {
  console.group('🎯 Step 1: Extracted Preview Content');
  console.log('📄 Total Pages Found:', content.pages.length);
  console.log('📄 Combined HTML Length:', content.html.length, 'characters');
  console.log('🎨 CSS Length:', content.css.length, 'characters');
  console.log('📋 Complete Document Length:', content.completeDocument.length, 'characters');
  
  content.pages.forEach((page) => {
    console.log(`📄 Page ${page.pageNumber}: ${page.html.length} characters`);
  });
  
  console.groupEnd();
}

// Simple HTML extraction that just uses the already-rendered DOM
export const extractHTMLForPDF = async (): Promise<string> => {
  try {
    console.log('🔄 Extracting HTML for PDF (simplified approach)');
    
    // Use the existing DOM-based extraction approach but keep it simple
    const previewElement = document.querySelector('[data-template-preview]') as HTMLElement;
    
    if (!previewElement) {
      throw new Error('No preview element found for extraction');
    }
    
    // Just extract the content with minimal processing
    const content = extractPreviewContent(previewElement);
    
    console.log('✅ HTML extracted successfully (simplified)');
    return content.completeDocument;
    
  } catch (error) {
    console.error('❌ Failed to extract HTML:', error);
    throw new Error(`HTML extraction failed: ${error}`);
  }
}; 