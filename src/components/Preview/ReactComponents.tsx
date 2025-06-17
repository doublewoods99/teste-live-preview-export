import React from 'react';
import type { ResumeSchema } from '../../types/resume';
import { calculateLayoutMeasurements, PAGE } from '../../utils/layout/measurements';

interface ReactComponentsProps {
  resume: ResumeSchema;
}

// React components for clean HTML preview rendering
export const ResumePreviewComponents: React.FC<ReactComponentsProps> = ({ resume }) => {
  const layout = calculateLayoutMeasurements(resume.format);

  // Convert layout measurements to CSS styles for web display using proper DPI conversion
  const styles = {
    page: {
      fontFamily: resume.format.fontFamily === 'Times New Roman' ? 'Times, "Times New Roman", serif' : 
                  resume.format.fontFamily === 'Georgia' ? 'Georgia, serif' : 
                  'Arial, sans-serif',
      fontSize: `${PAGE.toPx(layout.fontSizePt)}px`,
      lineHeight: 1.4,
      padding: `${PAGE.toPx(layout.marginTopPt)}px ${PAGE.toPx(layout.marginRightPt)}px ${PAGE.toPx(layout.marginBottomPt)}px ${PAGE.toPx(layout.marginLeftPt)}px`,
      backgroundColor: '#ffffff',
      width: `${PAGE.toPx(layout.pageWidthPt)}px`,
      minHeight: `${PAGE.toPx(layout.pageHeightPt)}px`,
      margin: '0 auto',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
    } as React.CSSProperties,
    
    header: {
      textAlign: 'center' as const,
      marginBottom: `${PAGE.toPx(layout.sectionSpacingPt)}px`,
    } as React.CSSProperties,
    
    name: {
      fontSize: `${PAGE.toPx(layout.fontSizePt * 1.5)}px`,
      fontWeight: 'bold',
      marginBottom: `${PAGE.toPx(layout.lineHeightPt * 0.5)}px`,
      color: '#333333',
      margin: 0,
    } as React.CSSProperties,
    
    title: {
      fontSize: `${PAGE.toPx(layout.fontSizePt)}px`,
      marginBottom: `${PAGE.toPx(layout.lineHeightPt)}px`,
      color: '#666666',
      margin: 0,
    } as React.CSSProperties,
    
    contact: {
      fontSize: `${PAGE.toPx(layout.fontSizePt * 0.9)}px`,
      color: '#666666',
      margin: 0,
    } as React.CSSProperties,
    
    sectionTitle: {
      fontSize: `${PAGE.toPx(layout.fontSizePt * 1.2)}px`,
      fontWeight: 'bold',
      textTransform: 'uppercase' as const,
      borderBottom: '0.5px solid #cccccc',
      paddingBottom: '2px',
      margin: 0,
      marginBottom: `${PAGE.toPx(layout.itemSpacingPt)}px`,
    } as React.CSSProperties,
    
    section: {
      marginBottom: `${PAGE.toPx(layout.sectionSpacingPt)}px`,
    } as React.CSSProperties,
    
    jobTitle: {
      fontSize: `${PAGE.toPx(layout.fontSizePt)}px`,
      fontWeight: 'bold',
      marginBottom: `${PAGE.toPx(layout.itemSpacingPt * 0.5)}px`,
      margin: 0,
    } as React.CSSProperties,
    
    jobDetails: {
      fontSize: `${PAGE.toPx(layout.fontSizePt * 0.9)}px`,
      color: '#666666',
      margin: 0,
      marginBottom: `${PAGE.toPx(layout.itemSpacingPt * 0.5)}px`,
    } as React.CSSProperties,
    
    bulletPoint: {
      fontSize: `${PAGE.toPx(layout.fontSizePt)}px`,
      marginBottom: `${PAGE.toPx(layout.itemSpacingPt * 0.25)}px`,
      paddingLeft: '15px',
      position: 'relative' as const,
    } as React.CSSProperties,
    
    bulletText: {
      margin: 0,
    } as React.CSSProperties,
    
    bullet: {
      position: 'absolute' as const,
      left: '0',
      top: '0',
    } as React.CSSProperties,
    
    eduTitle: {
      fontSize: `${PAGE.toPx(layout.fontSizePt)}px`,
      fontWeight: 'bold',
      margin: 0,
    } as React.CSSProperties,
    
    eduDetails: {
      fontSize: `${PAGE.toPx(layout.fontSizePt * 0.9)}px`,
      color: '#666666',
      margin: 0,
    } as React.CSSProperties,
    
    skillsText: {
      fontSize: `${PAGE.toPx(layout.fontSizePt)}px`,
      margin: 0,
    } as React.CSSProperties,
    
    jobContainer: {
      marginBottom: `${PAGE.toPx(layout.itemSpacingPt)}px`,
    } as React.CSSProperties,
    
    eduContainer: {
      marginBottom: `${PAGE.toPx(layout.itemSpacingPt)}px`,
    } as React.CSSProperties,
  };

  return (
    <div style={styles.page}>
      {/* Header Section */}
      <div style={styles.header}>
        <h1 style={styles.name}>{resume.content.personalInfo.name}</h1>
        {resume.content.personalInfo.title && (
          <div style={styles.title}>{resume.content.personalInfo.title}</div>
        )}
        <div style={styles.contact}>
          {resume.content.personalInfo.email} • {resume.content.personalInfo.phone} • {resume.content.personalInfo.location}
        </div>
      </div>

      {/* Professional Summary */}
      {resume.content.summary && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>PROFESSIONAL SUMMARY</h2>
          <p style={{ margin: 0 }}>{resume.content.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {resume.content.experience.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>WORK EXPERIENCE</h2>
          {resume.content.experience.map((job, index) => (
            <div key={index} style={styles.jobContainer}>
              <div style={styles.jobTitle}>{job.position}</div>
              <div style={styles.jobDetails}>
                {job.company} • {job.startDate} - {job.current ? 'Present' : job.endDate}
              </div>
              {job.description.map((desc, descIndex) => (
                <div key={descIndex} style={styles.bulletPoint}>
                  <span style={styles.bullet}>•</span>
                  <div style={styles.bulletText}>{desc}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.content.education.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>EDUCATION</h2>
          {resume.content.education.map((edu, index) => (
            <div key={index} style={styles.eduContainer}>
              <div style={styles.eduTitle}>
                {edu.degree} in {edu.field}
              </div>
              <div style={styles.eduDetails}>
                {edu.school} • {edu.graduationDate}
                {edu.gpa && ` • GPA: ${edu.gpa}`}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.content.skills.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>SKILLS</h2>
          <div style={styles.skillsText}>
            {resume.content.skills.join(' • ')}
          </div>
        </div>
      )}
    </div>
  );
}; 