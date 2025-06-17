import React from 'react';
import type { ResumeSchema } from '../../types/resume';

interface ClassicTemplateProps {
  resume: ResumeSchema;
}

export const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ resume }) => {
  // Simple CSS using direct CSS units - let the browser handle everything!
  const styles = {
    container: {
      fontFamily: resume.format.fontFamily === 'Times New Roman' ? 'Times, serif' : 
                  resume.format.fontFamily === 'Georgia' ? 'Times, serif' : 
                  'Arial, Helvetica, sans-serif',
      fontSize: `${resume.format.fontSize}pt`,
      lineHeight: resume.format.lineHeight,
      color: '#333333',
      margin: `${resume.format.margins.top}pt ${resume.format.margins.right}pt ${resume.format.margins.bottom}pt ${resume.format.margins.left}pt`,
      boxSizing: 'border-box' as const,
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: `${resume.format.sectionSpacing}pt`,
      borderBottom: '2px solid #333333',
      paddingBottom: `${resume.format.itemSpacing}pt`,
    },
    name: {
      fontSize: `${resume.format.fontSize * 1.8}pt`,
      fontWeight: '700',
      marginBottom: `${resume.format.fontSize * resume.format.lineHeight * 0.5}pt`,
      color: '#333333',
      margin: 0,
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
    },
    title: {
      fontSize: `${resume.format.fontSize * 1.1}pt`,
      marginBottom: `${resume.format.fontSize * resume.format.lineHeight}pt`,
      color: '#666666',
      margin: 0,
      fontStyle: 'italic',
    },
    contact: {
      fontSize: `${resume.format.fontSize * 0.9}pt`,
      color: '#666666',
      margin: 0,
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap' as const,
      gap: '15px',
    },
    section: {
      marginBottom: `${resume.format.sectionSpacing}pt`,
    },
    sectionTitle: {
      fontSize: `${resume.format.fontSize * 1.2}pt`,
      fontWeight: '700',
      textTransform: 'uppercase' as const,
      marginBottom: `${resume.format.itemSpacing}pt`,
      borderBottom: '1px solid #333333',
      paddingBottom: '3px',
      color: '#333333',
      letterSpacing: '0.5px',
    },
    jobTitle: {
      fontSize: `${resume.format.fontSize * 1.05}pt`,
      fontWeight: '600',
      marginBottom: `${resume.format.itemSpacing * 0.5}pt`,
      color: '#333333',
    },
    jobDetails: {
      fontSize: `${resume.format.fontSize * 0.9}pt`,
      color: '#666666',
      marginBottom: `${resume.format.itemSpacing * 0.5}pt`,
      fontStyle: 'italic',
    },
    bulletList: {
      margin: 0,
      paddingLeft: '18px',
    },
    bulletItem: {
      fontSize: `${resume.format.fontSize}pt`,
      marginBottom: `${resume.format.itemSpacing * 0.3}pt`,
      color: '#333333',
      lineHeight: resume.format.lineHeight,
    },
    eduTitle: {
      fontSize: `${resume.format.fontSize * 1.05}pt`,
      fontWeight: '600',
      color: '#333333',
    },
    eduDetails: {
      fontSize: `${resume.format.fontSize * 0.9}pt`,
      color: '#666666',
      fontStyle: 'italic',
    },
    skillsText: {
      fontSize: `${resume.format.fontSize}pt`,
      color: '#333333',
      lineHeight: 1.6,
    },
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <h1 style={styles.name}>{resume.content.personalInfo.name}</h1>
        {resume.content.personalInfo.title && (
          <p style={styles.title}>{resume.content.personalInfo.title}</p>
        )}
        <div style={styles.contact}>
          <span>{resume.content.personalInfo.email}</span>
          <span>{resume.content.personalInfo.phone}</span>
          <span>{resume.content.personalInfo.location}</span>
        </div>
      </div>

      {/* Professional Summary */}
      {resume.content.summary && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Professional Summary</h2>
          <p style={{ margin: 0 }}>{resume.content.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {resume.content.experience.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Professional Experience</h2>
          {resume.content.experience.map((job, index) => (
            <div key={index} style={{ marginBottom: `${resume.format.itemSpacing * 1.5}pt` }}>
              <div style={styles.jobTitle}>{job.position}</div>
              <div style={styles.jobDetails}>
                {job.company} | {job.startDate} - {job.current ? 'Present' : job.endDate}
              </div>
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
              <div style={styles.eduTitle}>
                {edu.degree} in {edu.field}
              </div>
              <div style={styles.eduDetails}>
                {edu.school} | {edu.graduationDate}
                {edu.gpa && ` | GPA: ${edu.gpa}`}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.content.skills.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Core Competencies</h2>
          <p style={styles.skillsText}>
            {resume.content.skills.join(' • ')}
          </p>
        </div>
      )}
    </div>
  );
}; 