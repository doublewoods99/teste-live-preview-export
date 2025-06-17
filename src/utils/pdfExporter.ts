import { extractPreviewContent } from './htmlExtractor';

interface PdfExportOptions {
  format?: 'A4' | 'Letter';
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  printBackground?: boolean;
}

export async function exportToPDF(
  previewElement: HTMLElement,
  filename: string = 'resume.pdf',
  options: PdfExportOptions = {}
): Promise<boolean> {
  try {
    console.log('Starting PDF export...');
    
    // Extract HTML from the preview component
    const extractedData = extractPreviewContent(previewElement);
    
    if (!extractedData.completeDocument) {
      throw new Error('Failed to extract HTML from preview');
    }

    console.log('HTML extracted successfully:', {
      htmlLength: extractedData.completeDocument.length,
      pages: extractedData.pages.length
    });

    // Send to Vercel serverless function
    const response = await fetch('/api/pdf-export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: extractedData.completeDocument,
        options: {
          format: options.format || 'A4',
          printBackground: options.printBackground !== false,
          margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px',
            ...options.margin
          }
        }
      }),
    });

    console.log('Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.error('Server error details:', errorData);
        errorMessage = `${errorData.error || errorMessage}${errorData.details ? ` (${errorData.details})` : ''}`;
      } catch (jsonError) {
        console.error('Failed to parse error response as JSON:', jsonError);
        try {
          const textError = await response.text();
          console.error('Error response text:', textError);
          errorMessage = textError || errorMessage;
        } catch (textError) {
          console.error('Failed to get error response text:', textError);
        }
      }
      throw new Error(`PDF generation failed: ${errorMessage}`);
    }

    // Get the PDF blob
    const pdfBlob = await response.blob();
    console.log('PDF blob received, size:', pdfBlob.size, 'bytes');
    
    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    console.log('PDF exported successfully!');
    return true;
    
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
}

 