import React, { useEffect, useRef, useState } from 'react';
import type { ResumeSchema } from '../../types/resume';
import { calculateLayoutMeasurements, PAGE } from '../../utils/layout/measurements';
// import { createPageBreakDetector } from '../../utils/layout/pagination';
import { createHeightCalculator } from '../../utils/layout/heightCalculation';

interface PaginatedPreviewProps {
  resume: ResumeSchema;
}

interface PageContent {
  pageNumber: number;
  elements: React.ReactElement[];
  remainingHeight: number;
}

const PaginatedPreviewComponent = React.forwardRef<HTMLDivElement, PaginatedPreviewProps>(({ resume }, ref) => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const measureRef = useRef<HTMLDivElement>(null);
  const layout = calculateLayoutMeasurements(resume.format);
  const heightCalculator = createHeightCalculator(resume);

  // Use proper DPI conversion from measurements utility instead of hardcoded 1.35
  const toPx = (pt: number) => `${PAGE.toPx(pt)}px`;

  const pageStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
      alignItems: 'center',
    },
    page: {
      width: toPx(layout.pageWidthPt),
      height: toPx(layout.pageHeightPt),
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      fontFamily: resume.format.fontFamily === 'Times New Roman' ? 'Times, serif' : 
                  resume.format.fontFamily === 'Georgia' ? 'Times, serif' : 
                  'Arial, Helvetica, sans-serif',
      fontSize: toPx(layout.fontSizePt),
      lineHeight: 1.4,
      padding: `${toPx(layout.marginTopPt)} ${toPx(layout.marginRightPt)} ${toPx(layout.marginBottomPt)} ${toPx(layout.marginLeftPt)}`,
      color: '#333333',
      position: 'relative' as const,
      overflow: 'hidden',
      pageBreakAfter: 'always' as const,
    },
    pageNumber: {
      position: 'absolute' as const,
      bottom: '10px',
      right: '20px',
      fontSize: '10px',
      color: '#999',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: toPx(layout.sectionSpacingPt),
    },
    name: {
      fontSize: toPx(layout.fontSizePt * 1.5),
      fontWeight: '700',
      marginBottom: toPx(layout.lineHeightPt * 0.5),
      color: '#333333',
      margin: 0,
    },
    title: {
      fontSize: toPx(layout.fontSizePt),
      marginBottom: toPx(layout.lineHeightPt),
      color: '#666666',
      margin: 0,
      lineHeight: 1.4,
    },
    contact: {
      fontSize: toPx(layout.fontSizePt * 0.9),
      color: '#666666',
      margin: 0,
    },
    section: {
      marginBottom: toPx(layout.sectionSpacingPt),
    },
    sectionTitle: {
      fontSize: toPx(layout.fontSizePt * 1.2),
      fontWeight: '700',
      textTransform: 'uppercase' as const,
      marginBottom: toPx(layout.itemSpacingPt),
      borderBottom: '0.5px solid #cccccc',
      paddingBottom: '2px',
      color: '#333333',
    },
    jobTitle: {
      fontSize: toPx(layout.fontSizePt),
      fontWeight: '600',
      marginBottom: toPx(layout.itemSpacingPt * 0.5),
      color: '#333333',
    },
    jobDetails: {
      fontSize: toPx(layout.fontSizePt * 0.9),
      color: '#666666',
      marginBottom: toPx(layout.itemSpacingPt * 0.5),
    },
    bulletList: {
      margin: 0,
      paddingLeft: '15px',
    },
    bulletItem: {
      fontSize: toPx(layout.fontSizePt),
      marginBottom: toPx(layout.itemSpacingPt * 0.25),
      color: '#333333',
      lineHeight: 1.4,
    },
    eduTitle: {
      fontSize: toPx(layout.fontSizePt),
      fontWeight: '600',
      color: '#333333',
    },
    eduDetails: {
      fontSize: toPx(layout.fontSizePt * 0.9),
      color: '#666666',
    },
    skillsText: {
      fontSize: toPx(layout.fontSizePt),
      color: '#333333',
    },
  };

  // Calculate available content height (page height minus margins)
  const contentHeightPx = PAGE.toPx(layout.pageHeightPt) - PAGE.toPx(layout.marginTopPt) - PAGE.toPx(layout.marginBottomPt);
  
  // Debug: Log the content height
  console.log(`Content height: ${contentHeightPx}px, Page height: ${PAGE.toPx(layout.pageHeightPt)}px`);

  // Function to measure element height (commented out - not currently used)
  /*
  const measureElementHeight = (element: HTMLElement): number => {
    if (!measureRef.current) return 0;
    
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.width = toPx(layout.contentWidthPt);
    tempDiv.style.fontFamily = pageStyles.page.fontFamily as string;
    tempDiv.style.fontSize = pageStyles.page.fontSize as string;
    tempDiv.style.lineHeight = String(pageStyles.page.lineHeight);
    
    tempDiv.appendChild(element.cloneNode(true));
    document.body.appendChild(tempDiv);
    
    const height = tempDiv.offsetHeight;
    document.body.removeChild(tempDiv);
    
    return height;
  };
  */

  // Function to create page content with overflow handling
  const createPaginatedContent = (): PageContent[] => {
    const pages: PageContent[] = [];
    let currentPage: PageContent = {
      pageNumber: 1,
      elements: [],
      remainingHeight: contentHeightPx,
    };

    const addElementToPage = (element: React.ReactElement, elementHeight: number) => {
      // Check if element fits on current page
      if (elementHeight > currentPage.remainingHeight && currentPage.elements.length > 0) {
        // Start a new page
        pages.push(currentPage);
        currentPage = {
          pageNumber: pages.length + 1,
          elements: [element],
          remainingHeight: contentHeightPx - elementHeight,
        };
      } else {
        // Add to current page
        currentPage.elements.push(element);
        currentPage.remainingHeight = Math.max(0, currentPage.remainingHeight - elementHeight);
      }
      
      // Debug logging
      console.log(`Added element with height ${elementHeight}px, remaining: ${currentPage.remainingHeight}px, page: ${currentPage.pageNumber}`);
    };

    // Header section (always on first page)
    const headerElement = (
      <div key="header" style={pageStyles.header}>
        <h1 style={pageStyles.name}>{resume.content.personalInfo.name}</h1>
        {resume.content.personalInfo.title && (
          <p style={pageStyles.title}>{resume.content.personalInfo.title}</p>
        )}
        <p style={pageStyles.contact}>
          {resume.content.personalInfo.email} • {resume.content.personalInfo.phone} • {resume.content.personalInfo.location}
        </p>
      </div>
    );

    // Use shared height calculation
    const headerHeight = heightCalculator.estimateElementHeight('header').heightPx;
    addElementToPage(headerElement, headerHeight);

    // Professional Summary
    if (resume.content.summary) {
      const summaryElement = (
        <div key="summary" style={pageStyles.section}>
          <h2 style={pageStyles.sectionTitle}>PROFESSIONAL SUMMARY</h2>
          <p style={{ margin: 0 }}>{resume.content.summary}</p>
        </div>
      );
      const summaryHeight = heightCalculator.estimateElementHeight('summary', resume.content.summary).heightPx;
      addElementToPage(summaryElement, summaryHeight);
    }

        // Work Experience
    if (resume.content.experience.length > 0) {
      const experienceTitle = (
        <h2 key="exp-title" style={pageStyles.sectionTitle}>WORK EXPERIENCE</h2>
      );
      addElementToPage(experienceTitle, heightCalculator.estimateElementHeight('section-title').heightPx);

      resume.content.experience.forEach((job, index) => {
        const jobElement = (
          <div key={`job-${index}`} style={{ marginBottom: toPx(layout.itemSpacingPt) }}>
            <div style={pageStyles.jobTitle}>{job.position}</div>
            <div style={pageStyles.jobDetails}>
              {job.company} • {job.startDate} - {job.current ? 'Present' : job.endDate}
            </div>
            {job.description.length > 0 && (
              <ul style={pageStyles.bulletList}>
                {job.description.map((desc, descIndex) => (
                  <li key={descIndex} style={pageStyles.bulletItem}>
                    {desc}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
        
        // Use shared height calculation
        const jobHeight = heightCalculator.estimateElementHeight('job', job).heightPx;
        addElementToPage(jobElement, jobHeight);
      });
    }

    // Education
    if (resume.content.education.length > 0) {
      const educationTitle = (
        <h2 key="edu-title" style={pageStyles.sectionTitle}>EDUCATION</h2>
      );
      addElementToPage(educationTitle, heightCalculator.estimateElementHeight('section-title').heightPx);

      resume.content.education.forEach((edu, index) => {
        const eduElement = (
          <div key={`edu-${index}`} style={{ marginBottom: toPx(layout.itemSpacingPt) }}>
            <div style={pageStyles.eduTitle}>
              {edu.degree} in {edu.field}
            </div>
            <div style={pageStyles.eduDetails}>
              {edu.school} • {edu.graduationDate}
              {edu.gpa && ` • GPA: ${edu.gpa}`}
            </div>
          </div>
        );
        
        addElementToPage(eduElement, heightCalculator.estimateElementHeight('education').heightPx);
      });
    }

    // Skills
    if (resume.content.skills.length > 0) {
      const skillsElement = (
        <div key="skills" style={pageStyles.section}>
          <h2 style={pageStyles.sectionTitle}>SKILLS</h2>
          <p style={pageStyles.skillsText}>
            {resume.content.skills.join(' • ')}
          </p>
        </div>
      );
      
      const skillsHeight = heightCalculator.estimateElementHeight('skills', { skills: resume.content.skills }).heightPx;
      addElementToPage(skillsElement, skillsHeight);
    }

    // Force a second page for testing (remove this in production)
    if (pages.length === 0) {
      // If we still have only one page, force a break to test pagination
      const testElement = (
        <div key="test-content" style={{ marginBottom: toPx(layout.sectionSpacingPt) }}>
          <h2 style={pageStyles.sectionTitle}>ADDITIONAL CONTENT (TEST)</h2>
          <p>This is test content to force pagination...</p>
          <p>Adding more content to ensure page break happens...</p>
          <p>More test content...</p>
          <p>Even more test content...</p>
          <p>This should trigger a page break...</p>
        </div>
      );
      
      // Add large content to force page break
      addElementToPage(testElement, 300); // Large height to force break
    }

    // Add the last page
    if (currentPage.elements.length > 0) {
      pages.push(currentPage);
    }

    console.log(`Final pagination result: ${pages.length} pages`);
    return pages;
  };

  useEffect(() => {
    const paginatedContent = createPaginatedContent();
    setPages(paginatedContent);
  }, [resume]);

  useEffect(() => {
    // Cleanup function for pagination calculator
    return () => {
      // Any cleanup if needed
    };
  }, []);

  return (
    <div ref={ref || measureRef} style={pageStyles.container}>
      {/* Debug info */}
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '10px', 
        marginBottom: '20px', 
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        Debug: Total pages: {pages.length} | Content height: {Math.round(contentHeightPx)}px
        {pages.map((page, index) => (
          <div key={index}>
            Page {page.pageNumber}: {page.elements.length} elements, {Math.round(page.remainingHeight)}px remaining
          </div>
        ))}
      </div>
      
      {pages.map((page) => (
        <div key={page.pageNumber} style={pageStyles.page}>
          {page.elements}
          <div style={pageStyles.pageNumber}>
            Page {page.pageNumber} of {pages.length}
          </div>
        </div>
      ))}
    </div>
  );
});

// Add display name for debugging
PaginatedPreviewComponent.displayName = 'PaginatedPreview';

// Export the component
export const PaginatedPreview = PaginatedPreviewComponent; 