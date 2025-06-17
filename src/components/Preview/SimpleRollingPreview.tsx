import React, { useRef, useEffect, useState } from 'react';
import type { ResumeSchema } from '../../types/resume';
import { useResumeStore } from '../../context/resumeStore';
import { getTemplate } from '../../utils/templateRegistry';
import { calculateLayoutMeasurements } from '../../utils/layout/measurements';

interface SimpleRollingPreviewProps {
  resume: ResumeSchema;
}

export const SimpleRollingPreview = React.forwardRef<HTMLDivElement, SimpleRollingPreviewProps>(
  ({ resume }, ref) => {
    const { selectedTemplateId } = useResumeStore();
    const measureRef = useRef<HTMLDivElement>(null);
    const [pageCount, setPageCount] = useState(1);
    
    const template = getTemplate(selectedTemplateId);
    const layout = calculateLayoutMeasurements(resume.format);
    
    // Convert pt to px
    const toPx = (pt: number) => `${pt * 1.35}px`;
    
    // Page dimensions - templates handle their own margins
    const pageWidth = layout.pageWidthPt * 1.35;
    const pageHeight = layout.pageHeightPt * 1.35;
    
    // Full page dimensions for template-controlled margins
    const contentWidth = layout.pageWidthPt * 1.35;
    const contentHeight = layout.pageHeightPt * 1.35;
    
    // Measure content and determine page count
    useEffect(() => {
      if (measureRef.current) {
        const actualContentHeight = measureRef.current.scrollHeight;
        const pagesNeeded = Math.ceil(actualContentHeight / contentHeight);
        
        // DEBUG: Log pagination calculations
        console.log('🔍 PAGINATION DEBUG:', {
          actualContentHeight: actualContentHeight,
          pageHeight: pageHeight,
          contentHeight: contentHeight,
          pagesNeeded: pagesNeeded,
          ratio: actualContentHeight / contentHeight,
          pageHeightPt: layout.pageHeightPt,
          marginTopPt: layout.marginTopPt,
          marginBottomPt: layout.marginBottomPt
        });
        
        setPageCount(Math.max(1, pagesNeeded));
      }
    }, [resume, selectedTemplateId, contentHeight, pageHeight, layout]);

    if (!template) {
      return <div>Template not found</div>;
    }

    const TemplateComponent = template.component;
    
    return (
      <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        {/* Hidden measurement container */}
        <div 
          ref={measureRef}
          style={{ 
            position: 'absolute', 
            top: '-9999px', 
            width: `${contentWidth}px`,
            visibility: 'hidden'
          }}
        >
          <TemplateComponent resume={resume} />
        </div>

        {/* Generate pages */}
        {Array.from({ length: pageCount }, (_, pageIndex) => (
          <div
            key={pageIndex + 1}
            style={{
              width: `${pageWidth}px`,
              height: `${pageHeight}px`,
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Page number */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '20px',
              fontSize: '10px',
              color: '#666',
              zIndex: 1000,
            }}>
              {pageIndex + 1}
            </div>

            {/* Content with proper offset for this page */}
            <div 
              style={{ 
                transform: `translateY(-${pageIndex * pageHeight}px)`,
                width: '100%',
              }}
            >
              <TemplateComponent resume={resume} />
            </div>
          </div>
        ))}
      </div>
    );
  }
);

SimpleRollingPreview.displayName = 'SimpleRollingPreview'; 