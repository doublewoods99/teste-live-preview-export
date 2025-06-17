import React from 'react';
import { useResumeStore } from '../../context/resumeStore';
import { PAGE } from '../../utils/layout/measurements';
import { TemplateSelector } from '../TemplateSelector/TemplateSelector';

export const ResumeEditor: React.FC = () => {
  const { 
    resume, 
    updatePersonalInfo, 
    updateSummary, 
    updateFormat 
  } = useResumeStore();

  const handlePersonalInfoChange = (field: string, value: string) => {
    updatePersonalInfo({ [field]: value });
  };

  const handleFormatChange = (field: string, value: any) => {
    updateFormat({ [field]: value });
  };

  const handleMarginChange = (side: string, value: number) => {
    updateFormat({
      margins: {
        ...resume.format.margins,
        [side]: value,
      },
    });
  };

  const editorStyle = {
    padding: '20px',
    backgroundColor: '#f8fafc',
    height: 'calc(100vh - 40px)',
    overflowY: 'auto' as const,
    borderRight: '1px solid #e2e8f0',
  };

  const sectionStyle = {
    marginBottom: '24px',
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const sectionTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1e293b',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '4px',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '8px',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '4px',
    color: '#374151',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical' as const,
  };

  const rangeContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  };

  const rangeStyle = {
    flex: 1,
    margin: 0,
  };

  const rangeValueStyle = {
    minWidth: '40px',
    textAlign: 'center' as const,
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
  };

  return (
    <div style={editorStyle}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '700',
        marginBottom: '24px',
        color: '#111827',
        textAlign: 'center',
      }}>
        Resume Editor
      </h2>

      {/* Template Selector */}
      <TemplateSelector />

      {/* Personal Information */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Personal Information</h3>
        
        <label style={labelStyle}>Full Name</label>
        <input
          type="text"
          value={resume.content.personalInfo.name}
          onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
          style={inputStyle}
          placeholder="John Doe"
        />

        <label style={labelStyle}>Professional Title</label>
        <input
          type="text"
          value={resume.content.personalInfo.title}
          onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
          style={inputStyle}
          placeholder="Senior Software Engineer"
        />

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          value={resume.content.personalInfo.email}
          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
          style={inputStyle}
          placeholder="john.doe@email.com"
        />

        <label style={labelStyle}>Phone</label>
        <input
          type="tel"
          value={resume.content.personalInfo.phone}
          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
          style={inputStyle}
          placeholder="(555) 123-4567"
        />

        <label style={labelStyle}>Location</label>
        <input
          type="text"
          value={resume.content.personalInfo.location}
          onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
          style={inputStyle}
          placeholder="San Francisco, CA"
        />
      </div>

      {/* Professional Summary */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Professional Summary</h3>
        
        <label style={labelStyle}>Summary</label>
        <textarea
          value={resume.content.summary}
          onChange={(e) => updateSummary(e.target.value)}
          style={textareaStyle}
          placeholder="Write a brief professional summary..."
        />
      </div>

      {/* Format Settings */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Format Settings</h3>

        <label style={labelStyle}>Page Size</label>
        <select
          value={resume.format.pageSize}
          onChange={(e) => handleFormatChange('pageSize', e.target.value)}
          style={inputStyle}
        >
          <option value="A4">A4 ({PAGE.A4.widthPt} × {PAGE.A4.heightPt} pt)</option>
          <option value="Letter">US Letter ({PAGE.Letter.widthPt} × {PAGE.Letter.heightPt} pt)</option>
        </select>

        <label style={labelStyle}>Font Family</label>
        <select
          value={resume.format.fontFamily}
          onChange={(e) => handleFormatChange('fontFamily', e.target.value)}
          style={inputStyle}
        >
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>

        <label style={labelStyle}>Font Size (points)</label>
        <div style={rangeContainerStyle}>
          <input
            type="range"
            min="9"
            max="14"
            step="0.5"
            value={resume.format.fontSize}
            onChange={(e) => handleFormatChange('fontSize', parseFloat(e.target.value))}
            style={rangeStyle}
          />
          <span style={rangeValueStyle}>{resume.format.fontSize}pt</span>
        </div>

        <label style={labelStyle}>Line Height</label>
        <div style={rangeContainerStyle}>
          <input
            type="range"
            min="1.0"
            max="2.0"
            step="0.1"
            value={resume.format.lineHeight}
            onChange={(e) => handleFormatChange('lineHeight', parseFloat(e.target.value))}
            style={rangeStyle}
          />
          <span style={rangeValueStyle}>{resume.format.lineHeight}×</span>
        </div>
      </div>

      {/* Margins (in points) */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Margins (points)</h3>

        <label style={labelStyle}>Top Margin</label>
        <div style={rangeContainerStyle}>
          <input
            type="range"
            min="10"
            max="50"
            step="2"
            value={resume.format.margins.top}
            onChange={(e) => handleMarginChange('top', parseInt(e.target.value))}
            style={rangeStyle}
          />
          <span style={rangeValueStyle}>{resume.format.margins.top}pt</span>
        </div>

        <label style={labelStyle}>Right Margin</label>
        <div style={rangeContainerStyle}>
          <input
            type="range"
            min="10"
            max="50"
            step="2"
            value={resume.format.margins.right}
            onChange={(e) => handleMarginChange('right', parseInt(e.target.value))}
            style={rangeStyle}
          />
          <span style={rangeValueStyle}>{resume.format.margins.right}pt</span>
        </div>

        <label style={labelStyle}>Bottom Margin</label>
        <div style={rangeContainerStyle}>
          <input
            type="range"
            min="10"
            max="50"
            step="2"
            value={resume.format.margins.bottom}
            onChange={(e) => handleMarginChange('bottom', parseInt(e.target.value))}
            style={rangeStyle}
          />
          <span style={rangeValueStyle}>{resume.format.margins.bottom}pt</span>
        </div>

        <label style={labelStyle}>Left Margin</label>
        <div style={rangeContainerStyle}>
          <input
            type="range"
            min="10"
            max="50"
            step="2"
            value={resume.format.margins.left}
            onChange={(e) => handleMarginChange('left', parseInt(e.target.value))}
            style={rangeStyle}
          />
          <span style={rangeValueStyle}>{resume.format.margins.left}pt</span>
        </div>
      </div>

      {/* Spacing */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Spacing</h3>

        <label style={labelStyle}>Section Spacing (points)</label>
        <div style={rangeContainerStyle}>
          <input
            type="range"
            min="8"
            max="24"
            step="2"
            value={resume.format.sectionSpacing}
            onChange={(e) => handleFormatChange('sectionSpacing', parseInt(e.target.value))}
            style={rangeStyle}
          />
          <span style={rangeValueStyle}>{resume.format.sectionSpacing}pt</span>
        </div>

        <label style={labelStyle}>Item Spacing (points)</label>
        <div style={rangeContainerStyle}>
          <input
            type="range"
            min="4"
            max="16"
            step="1"
            value={resume.format.itemSpacing}
            onChange={(e) => handleFormatChange('itemSpacing', parseInt(e.target.value))}
            style={rangeStyle}
          />
          <span style={rangeValueStyle}>{resume.format.itemSpacing}pt</span>
        </div>
      </div>

      {/* Precision Info */}
      <div style={{
        ...sectionStyle,
        backgroundColor: '#f0f9ff',
        border: '1px solid #0ea5e9',
      }}>
        <h3 style={{
          ...sectionTitleStyle,
          color: '#0369a1',
          borderBottomColor: '#0ea5e9',
        }}>
          📐 Precision Info
        </h3>
        <p style={{
          fontSize: '12px',
          color: '#075985',
          lineHeight: 1.4,
          margin: 0,
        }}>
          All measurements are stored in points (pt) for precision. The preview converts to pixels using a 96 DPI standard 
          for accurate web display. This ensures consistent rendering across different export formats.
        </p>
      </div>
    </div>
  );
}; 