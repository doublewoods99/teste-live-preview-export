import React from 'react';
import { useResumeStore } from '../../context/resumeStore';
import { getTemplate } from '../../utils/templateRegistry';

interface PaginatedPreviewProps {
  className?: string;
}

export const PaginatedPreview: React.FC<PaginatedPreviewProps> = ({ className }) => {
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
        width: '100%',
        maxWidth: '8.5in',
        minHeight: '11in',
        backgroundColor: 'white',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        padding: '0.5in',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'auto',
      }}
    >
      <TemplateComponent resume={resume} />
    </div>
  );
}; 