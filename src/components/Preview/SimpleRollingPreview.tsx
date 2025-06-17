import React from 'react';
import { useResumeStore } from '../../context/resumeStore';
import { getTemplate } from '../../utils/templateRegistry';

interface SimpleRollingPreviewProps {
  className?: string;
}

export const SimpleRollingPreview: React.FC<SimpleRollingPreviewProps> = ({ className }) => {
  const { resume, selectedTemplateId } = useResumeStore();
  const template = getTemplate(selectedTemplateId);

  if (!template) {
    return <div className={className}>Template not found</div>;
  }

  const TemplateComponent = template.component;

  // Simple preview - just render the template with basic styling
  return (
    <div 
      className={className}
      data-template-preview
      style={{
        width: '8.5in',      // Exact Letter size width
        minHeight: '11in',   // Exact Letter size height
        maxWidth: '8.5in',
        backgroundColor: 'white',
        margin: '0 auto',
        overflow: 'visible',
        // Ensure consistent box model
        boxSizing: 'border-box',
        // Match PDF page exactly
        padding: '0',
        // Remove conflicting font - let template handle its own fonts
      }}
    >
      <TemplateComponent resume={resume} />
    </div>
  );
}; 