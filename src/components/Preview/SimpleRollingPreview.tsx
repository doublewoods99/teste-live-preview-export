import React, { useRef, useEffect, useState } from 'react';
import type { ResumeSchema } from '../../types/resume';
import { useResumeStore } from '../../context/resumeStore';
import { getTemplate } from '../../utils/templateRegistry';
import { calculateLayoutMeasurements, PAGE } from '../../utils/layout/measurements';

interface SimpleRollingPreviewProps {
  resume: ResumeSchema;
}

export const SimpleRollingPreview = React.forwardRef<HTMLDivElement, SimpleRollingPreviewProps>(
  ({ resume }, ref) => {
    const { selectedTemplateId } = useResumeStore();
    const measureRef = useRef<HTMLDivElement>(null);
    const [pageCount, setPageCount] = useState(1);
    const [isCalculating, setIsCalculating] = useState(false);
    
    const template = getTemplate(selectedTemplateId);
    const layout = calculateLayoutMeasurements(resume.format);
    
    // Page dimensions - templates handle their own margins
    // Use proper DPI conversion from measurements utility instead of hardcoded 1.35
    const pageWidth = PAGE.toPx(layout.pageWidthPt);
    const pageHeight = PAGE.toPx(layout.pageHeightPt);
    
    // Full page dimensions for template-controlled margins
    const contentWidth = PAGE.toPx(layout.pageWidthPt);
    const contentHeight = PAGE.toPx(layout.pageHeightPt);
    
    // Measure content and determine page count
    useEffect(() => {
      if (measureRef.current && !isCalculating) {
        setIsCalculating(true);
        
        // Small delay to ensure DOM is fully rendered
        const measureTimeout = setTimeout(() => {
          if (measureRef.current) {
            const actualContentHeight = measureRef.current.scrollHeight;
            
            // Remove tolerance to match PDF behavior exactly
            // PDF generators don't use tolerance - they create breaks when content exceeds page height
            const pagesNeeded = Math.ceil(actualContentHeight / contentHeight);
            
            // Ensure minimum of 1 page
            const newPageCount = Math.max(1, pagesNeeded);
            
            // Always log pagination info for transparency
            if (newPageCount !== pageCount) {
              console.log('📄 Page count updated (matching PDF behavior):', {
                pages: newPageCount,
                contentHeight: Math.round(actualContentHeight),
                pageHeight: Math.round(contentHeight),
                ratio: Math.round((actualContentHeight / contentHeight) * 100) / 100,
                reason: newPageCount > pageCount ? 'Content expanded' : 'Content reduced'
              });
            }
            
            setPageCount(newPageCount);
            setIsCalculating(false);
          }
        }, 100);
        
        return () => {
          clearTimeout(measureTimeout);
          setIsCalculating(false);
        };
      }
    }, [resume.content, selectedTemplateId, contentHeight, pageCount, isCalculating]);

    if (!template) {
      return <div>Template not found</div>;
    }

    const TemplateComponent = template.component;
    
    return (
      <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        {/* Hidden measurement container - exactly matches PDF export dimensions */}
        <div 
          ref={measureRef}
          style={{ 
            position: 'absolute', 
            top: '-9999px', 
            width: `${contentWidth}px`,
            visibility: 'hidden',
            // Mirror PDF @page CSS rules for accurate measurement
            fontSize: `${PAGE.toPx(layout.fontSizePt)}px`,
            lineHeight: PAGE.toPx(layout.fontSizePt) * 1.4 + 'px',
            fontFamily: resume.format.fontFamily === 'Times New Roman' ? 'Times, serif' : 
                        resume.format.fontFamily === 'Georgia' ? 'Times, serif' : 
                        'Arial, Helvetica, sans-serif'
          }}
        >
          <TemplateComponent resume={resume} />
        </div>

        {/* Generate pages with improved page break simulation */}
        {pageCount === 1 ? (
          // Single page - show full content without transforms
          <div
            style={{
              width: `${pageWidth}px`,
              height: `${pageHeight}px`,
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #f0f0f0'
            }}
          >
            {/* Page number */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '20px',
              fontSize: '10px',
              color: '#999',
              zIndex: 1000,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              padding: '2px 4px',
              borderRadius: '2px'
            }}>
              Page 1 of 1
            </div>

            {/* Full content for single page */}
            <div 
              style={{ 
                width: '100%',
                fontSize: `${PAGE.toPx(layout.fontSizePt)}px`,
                lineHeight: 1.4,
                fontFamily: resume.format.fontFamily === 'Times New Roman' ? 'Times, serif' : 
                            resume.format.fontFamily === 'Georgia' ? 'Times, serif' : 
                            'Arial, Helvetica, sans-serif'
              }}
            >
              <TemplateComponent resume={resume} />
            </div>
          </div>
        ) : (
          // Multiple pages - use transform approach but extract unique content for PDF
          Array.from({ length: pageCount }, (_, pageIndex) => (
            <div
              key={pageIndex + 1}
              data-page-index={pageIndex}
              style={{
                width: `${pageWidth}px`,
                height: `${pageHeight}px`,
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #f0f0f0'
              }}
            >
              {/* Page number */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '20px',
                fontSize: '10px',
                color: '#999',
                zIndex: 1000,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '2px 4px',
                borderRadius: '2px'
              }}>
                Page {pageIndex + 1} of {pageCount}
              </div>

              {/* Content with proper offset for this page */}
              <div 
                style={{ 
                  transform: `translateY(-${pageIndex * pageHeight}px)`,
                  width: '100%',
                  fontSize: `${PAGE.toPx(layout.fontSizePt)}px`,
                  lineHeight: 1.4,
                  fontFamily: resume.format.fontFamily === 'Times New Roman' ? 'Times, serif' : 
                              resume.format.fontFamily === 'Georgia' ? 'Times, serif' : 
                              'Arial, Helvetica, sans-serif'
                }}
              >
                <TemplateComponent resume={resume} />
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
);

SimpleRollingPreview.displayName = 'SimpleRollingPreview'; 