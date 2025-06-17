import React from 'react';
import type { ResumeSchema } from '../../types/resume';

interface ModernTemplateProps {
  resume: ResumeSchema;
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({ resume }) => {
  // Simple CSS using direct CSS units - let the browser handle everything!
  const styles = {
    container: {
      fontFamily: resume.format.fontFamily === 'Times New Roman' ? 
                  '"Times New Roman", Times, "Liberation Serif", serif' : 
                  resume.format.fontFamily === 'Georgia' ? 
                  'Georgia, "Times New Roman", Times, serif' : 
                  'Arial, "Helvetica Neue", Helvetica, "Liberation Sans", sans-serif',
      fontSize: `${resume.format.fontSize}pt`,
      lineHeight: resume.format.lineHeight,
      color: '#333333',
      margin: `${resume.format.margins.top}pt ${resume.format.margins.right}pt ${resume.format.margins.bottom}pt ${resume.format.margins.left}pt`,
      boxSizing: 'border-box' as const,
      // Ensure consistent font rendering
      WebkitFontSmoothing: 'antialiased' as const,
      MozOsxFontSmoothing: 'grayscale' as const,
      textRendering: 'optimizeLegibility' as const,
    },
    header: {
      textAlign: 'left' as const,
      marginBottom: `${resume.format.sectionSpacing}pt`,
      borderLeft: '4px solid #4F46E5',
      paddingLeft: `${resume.format.itemSpacing}pt`,
    },
    name: {
      fontSize: `${resume.format.fontSize * 2.0}pt`,
      fontWeight: '300',
      marginBottom: `${resume.format.fontSize * resume.format.lineHeight * 0.3}pt`,
      color: '#4F46E5',
      margin: 0,
      letterSpacing: '0.5px',
    },
    title: {
      fontSize: `${resume.format.fontSize * 1.2}pt`,
      marginBottom: `${resume.format.fontSize * resume.format.lineHeight}pt`,
      color: '#6B7280',
      margin: 0,
      fontWeight: '400',
    },
    contact: {
      fontSize: `${resume.format.fontSize * 0.9}pt`,
      color: '#6B7280',
      margin: 0,
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '20px',
    },
    section: {
      marginBottom: `${resume.format.sectionSpacing}pt`,
    },
    sectionTitle: {
      fontSize: `${resume.format.fontSize * 1.3}pt`,
      fontWeight: '600',
      marginBottom: `${resume.format.itemSpacing}pt`,
      color: '#4F46E5',
      letterSpacing: '0.3px',
      textTransform: 'uppercase' as const,
    },
    jobTitle: {
      fontSize: `${resume.format.fontSize * 1.1}pt`,
      fontWeight: '600',
      marginBottom: `${resume.format.itemSpacing * 0.3}pt`,
      color: '#111827',
    },
    jobDetails: {
      fontSize: `${resume.format.fontSize * 0.9}pt`,
      color: '#6B7280',
      marginBottom: `${resume.format.itemSpacing * 0.5}pt`,
      fontWeight: '500',
    },
    bulletList: {
      margin: 0,
      paddingLeft: '20px',
    },
    bulletItem: {
      fontSize: `${resume.format.fontSize}pt`,
      marginBottom: `${resume.format.itemSpacing * 0.4}pt`,
      color: '#374151',
      lineHeight: resume.format.lineHeight,
    },
    eduTitle: {
      fontSize: `${resume.format.fontSize * 1.1}pt`,
      fontWeight: '600',
      color: '#111827',
    },
    eduDetails: {
      fontSize: `${resume.format.fontSize * 0.9}pt`,
      color: '#6B7280',
      fontWeight: '500',
    },
    skillsText: {
      fontSize: `${resume.format.fontSize}pt`,
      color: '#374151',
      lineHeight: 1.6,
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.name}>{resume.content.personalInfo.name}</h1>
        <div style={styles.title}>{resume.content.personalInfo.title}</div>
        <div style={styles.contact}>
          <span>✉ {resume.content.personalInfo.email}</span>
          <span>📞 {resume.content.personalInfo.phone}</span>
          <span>📍 {resume.content.personalInfo.location}</span>
        </div>
      </div>

      {/* Summary */}
      {resume.content.summary && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>About Me</h2>
          <p style={styles.skillsText}>{resume.content.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resume.content.experience.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Experience</h2>
          {resume.content.experience.map((job, index) => (
            <div key={index} style={{ marginBottom: `${resume.format.itemSpacing * 1.5}pt` }}>
              <div style={styles.jobTitle}>{job.position}</div>
              <div style={styles.jobDetails}>{job.company} • {job.startDate} - {job.current ? 'Present' : job.endDate}</div>
              {job.description.length > 0 && (
                <ul style={styles.bulletList}>
                  {job.description.map((desc, descIndex) => (
                    <li key={descIndex} style={styles.bulletItem}>
                      {desc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.content.education.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Education</h2>
          {resume.content.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: `${resume.format.itemSpacing}pt` }}>
              <div style={styles.eduTitle}>{edu.degree} in {edu.field}</div>
              <div style={styles.eduDetails}>{edu.school} • {edu.graduationDate} {edu.gpa && `• GPA: ${edu.gpa}`}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.content.skills.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Skills</h2>
          <p style={styles.skillsText}>{resume.content.skills.join(', ')}</p>
        </div>
      )}
    </div>
  );
}; 