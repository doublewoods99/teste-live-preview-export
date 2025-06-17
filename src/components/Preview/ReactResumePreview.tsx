import React from 'react';
import type { ResumeSchema } from '../../types/resume';
import { useResumeStore } from '../../context/resumeStore';
import { getTemplate } from '../../utils/templateRegistry';

interface ReactResumePreviewProps {
  resume: ResumeSchema;
}

export const ReactResumePreview: React.FC<ReactResumePreviewProps> = ({ resume }) => {
  const { selectedTemplateId } = useResumeStore();
  
  // Get the selected template
  const template = getTemplate(selectedTemplateId);
  
  if (!template) {
    // Fallback to error message if template not found
    return (
      <div style={{
        width: '100%',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        border: '2px dashed #cbd5e0',
        borderRadius: '8px',
        color: '#718096',
        fontSize: '16px',
        fontWeight: '500',
      }}>
        Template "{selectedTemplateId}" not found
      </div>
    );
  }

  // Dynamically render the selected template component
  const TemplateComponent = template.component;
  
  return <TemplateComponent resume={resume} />;
}; 