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

export function extractPreviewContent(previewElement: HTMLElement): ExtractedContent {
  if (!previewElement) {
    throw new Error('Preview element not found');
  }

  // Extract individual pages from the preview
  const extractedPages = extractIndividualPages(previewElement);
  
  // Get all the CSS from the document's stylesheets
  const originalCSS = extractOriginalCSS();

  // Create a complete HTML document that preserves the exact Preview styling
  const completeDocument = createOptimizedHTMLDocument(extractedPages, originalCSS);

  return {
    html: extractedPages.map(page => page.html).join('\n'),
    css: originalCSS,
    completeDocument,
    pages: extractedPages
  };
}

function extractIndividualPages(previewElement: HTMLElement): ExtractedPage[] {
  // Find all page divs - they have specific characteristics from PaginatedPreview
  const pageElements = Array.from(previewElement.children).filter(child => {
    const element = child as HTMLElement;
    const style = window.getComputedStyle(element);
    
    // Look for the page divs created in PaginatedPreview:
    // - Fixed width and height
    // - White background
    // - Box shadow (for the paper effect)
    // - Contains actual content (not debug info)
    const hasPageStyling = 
      style.backgroundColor === 'rgb(255, 255, 255)' &&
      style.boxShadow !== 'none' &&
      style.position === 'relative';
    
    const hasContent = element.textContent && element.textContent.trim().length > 50; // Meaningful content
    const isNotDebugInfo = !element.textContent?.includes('Debug: Total pages:');
    
    return hasPageStyling && hasContent && isNotDebugInfo;
  }) as HTMLElement[];

  console.log(`🔍 Found ${pageElements.length} page elements for extraction`);
  
  const extractedPages: ExtractedPage[] = [];

  pageElements.forEach((pageElement, index) => {
    // Clone the page element to avoid modifying the original
    const clonedPage = pageElement.cloneNode(true) as HTMLElement;
    
    // Clean up any page numbers or artifacts that shouldn't be in PDF
    const pageNumbers = clonedPage.querySelectorAll('div[style*="position: absolute"]');
    pageNumbers.forEach(pageNum => {
      if (pageNum.textContent?.includes('Page ')) {
        pageNum.remove();
      }
    });
    
    extractedPages.push({
      html: clonedPage.outerHTML,
      pageNumber: index + 1
    });
    
    console.log(`✅ Extracted page ${index + 1} with ${clonedPage.textContent?.length} characters`);
  });

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

function createOptimizedHTMLDocument(pages: ExtractedPage[], css: string): string {
  if (pages.length === 0) {
    return createSimpleHTMLDocument('', css);
  }

  // Create clean page structure for PDF - each page should fit exactly on PDF page
  const combinedHTML = pages.map((page, index) => {
    // Remove the wrapper div styling from the original page and just use the content
    return page.html;
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
    
    /* PDF-specific overrides - remove all container styling */
    body {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      display: block !important;
    }
    
    /* Ensure page divs break properly */
    @page {
      size: A4;
      margin: 0;
    }
    
    /* Target the actual page divs from PaginatedPreview */
    div[style*="box-shadow"]:not(:last-child) {
      page-break-after: always !important;
    }
    
    div[style*="box-shadow"] {
      page-break-inside: avoid !important;
      margin: 0 !important;
      box-shadow: none !important;
    }
    
    @media print {
      div[style*="box-shadow"]:not(:last-child) {
        page-break-after: always !important;
      }
      
      div[style*="box-shadow"] {
        page-break-inside: avoid !important;
        margin: 0 !important;
        box-shadow: none !important;
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
  
  content.pages.forEach((page, index) => {
    console.log(`📄 Page ${page.pageNumber}: ${page.html.length} characters`);
  });
  
  console.groupEnd();
} 