import React from 'react';
import { useResumeStore } from '../../context/resumeStore';
import { getAllTemplates } from '../../utils/templateRegistry';

export const TemplateSelector: React.FC = () => {
  const { selectedTemplateId, setTemplate } = useResumeStore();
  const templates = getAllTemplates();

  const containerStyle = {
    marginBottom: '24px',
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1e293b',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '4px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  };

  const getCardStyle = (templateId: string) => ({
    border: selectedTemplateId === templateId ? '2px solid #3b82f6' : '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '12px',
    cursor: 'pointer',
    backgroundColor: selectedTemplateId === templateId ? '#eff6ff' : '#ffffff',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
  });

  const templateNameStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px',
  };

  const templateDescStyle = {
    fontSize: '12px',
    color: '#6b7280',
    lineHeight: 1.4,
    marginBottom: '8px',
  };

  const categoryBadgeStyle = {
    display: 'inline-block',
    padding: '2px 8px',
    fontSize: '10px',
    fontWeight: '500',
    textTransform: 'uppercase' as const,
    borderRadius: '12px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
  };

  const selectedBadgeStyle = {
    position: 'absolute' as const,
    top: '8px',
    right: '8px',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
  };

  const previewStyle = {
    width: '100%',
    height: '60px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: '#6b7280',
    position: 'relative' as const,
    overflow: 'hidden',
  };

  const getPreviewContent = (templateId: string) => {
    switch (templateId) {
      case 'classic':
        return (
          <div style={{ textAlign: 'center', padding: '8px' }}>
            <div style={{ 
              height: '2px', 
              backgroundColor: '#333', 
              marginBottom: '4px',
              width: '80%',
              margin: '0 auto 4px'
            }} />
            <div style={{ 
              height: '1px', 
              backgroundColor: '#666', 
              marginBottom: '2px',
              width: '60%',
              margin: '0 auto 2px'
            }} />
            <div style={{ 
              height: '1px', 
              backgroundColor: '#999', 
              width: '70%',
              margin: '0 auto'
            }} />
          </div>
        );
      case 'modern':
        return (
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{
              backgroundColor: '#4a5568',
              width: '35%',
              padding: '4px',
            }}>
              <div style={{ backgroundColor: 'white', height: '2px', marginBottom: '2px', opacity: 0.8 }} />
              <div style={{ backgroundColor: 'white', height: '1px', marginBottom: '2px', opacity: 0.6, width: '80%' }} />
              <div style={{ backgroundColor: 'white', height: '1px', opacity: 0.4, width: '60%' }} />
            </div>
            <div style={{ 
              flex: 1, 
              padding: '4px',
            }}>
              <div style={{ height: '2px', backgroundColor: '#333', marginBottom: '2px', width: '90%' }} />
              <div style={{ height: '1px', backgroundColor: '#666', marginBottom: '1px', width: '70%' }} />
              <div style={{ height: '1px', backgroundColor: '#999', width: '80%' }} />
            </div>
          </div>
        );
      default:
        return 'Preview';
    }
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Resume Template</h3>
      
      <div style={gridStyle}>
        {templates.map((template) => (
          <div
            key={template.id}
            style={getCardStyle(template.id)}
            onClick={() => setTemplate(template.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = selectedTemplateId === template.id 
                ? '0 1px 3px rgba(0, 0, 0, 0.1)' 
                : '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
          >
            {selectedTemplateId === template.id && (
              <div style={selectedBadgeStyle}>✓</div>
            )}
            
            <div style={previewStyle}>
              {getPreviewContent(template.id)}
            </div>
            
            <div style={templateNameStyle}>{template.name}</div>
            <div style={templateDescStyle}>{template.description}</div>
            <div style={categoryBadgeStyle}>{template.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
}; 