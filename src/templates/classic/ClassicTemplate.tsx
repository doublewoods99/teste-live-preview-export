import React from 'react';
import type { ResumeSchema } from '../../types/resume';
import { calculateLayoutMeasurements, PAGE } from '../../utils/layout/measurements';

interface ClassicTemplateProps {
  resume: ResumeSchema;
}

export const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ resume }) => {
  const layout = calculateLayoutMeasurements(resume.format);

  // Use proper DPI conversion from measurements utility instead of hardcoded 1.35
  const toPx = (pt: number) => `${PAGE.toPx(pt)}px`;

  const styles = {
    container: {
      fontFamily: resume.format.fontFamily === 'Times New Roman' ? 'Times, serif' : 
                  resume.format.fontFamily === 'Georgia' ? 'Times, serif' : 
                  'Arial, Helvetica, sans-serif',
      fontSize: toPx(layout.fontSizePt),
      lineHeight: 1.4,
      color: '#333333',
      padding: `${toPx(layout.marginTopPt)} ${toPx(layout.marginRightPt)} ${toPx(layout.marginBottomPt)} ${toPx(layout.marginLeftPt)}`,
      boxSizing: 'border-box' as const,
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: toPx(layout.sectionSpacingPt),
      borderBottom: '2px solid #333333',
      paddingBottom: toPx(layout.itemSpacingPt),
    },
    name: {
      fontSize: toPx(layout.fontSizePt * 1.8),
      fontWeight: '700',
      marginBottom: toPx(layout.lineHeightPt * 0.5),
      color: '#333333',
      margin: 0,
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
    },
    title: {
      fontSize: toPx(layout.fontSizePt * 1.1),
      marginBottom: toPx(layout.lineHeightPt),
      color: '#666666',
      margin: 0,
      fontStyle: 'italic',
    },
    contact: {
      fontSize: toPx(layout.fontSizePt * 0.9),
      color: '#666666',
      margin: 0,
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap' as const,
      gap: '15px',
    },
    section: {
      marginBottom: toPx(layout.sectionSpacingPt),
    },
    sectionTitle: {
      fontSize: toPx(layout.fontSizePt * 1.2),
      fontWeight: '700',
      textTransform: 'uppercase' as const,
      marginBottom: toPx(layout.itemSpacingPt),
      borderBottom: '1px solid #333333',
      paddingBottom: '3px',
      color: '#333333',
      letterSpacing: '0.5px',
    },
    jobTitle: {
      fontSize: toPx(layout.fontSizePt * 1.05),
      fontWeight: '600',
      marginBottom: toPx(layout.itemSpacingPt * 0.5),
      color: '#333333',
    },
    jobDetails: {
      fontSize: toPx(layout.fontSizePt * 0.9),
      color: '#666666',
      marginBottom: toPx(layout.itemSpacingPt * 0.5),
      fontStyle: 'italic',
    },
    bulletList: {
      margin: 0,
      paddingLeft: '18px',
    },
    bulletItem: {
      fontSize: toPx(layout.fontSizePt),
      marginBottom: toPx(layout.itemSpacingPt * 0.3),
      color: '#333333',
      lineHeight: 1.4,
    },
    eduTitle: {
      fontSize: toPx(layout.fontSizePt * 1.05),
      fontWeight: '600',
      color: '#333333',
    },
    eduDetails: {
      fontSize: toPx(layout.fontSizePt * 0.9),
      color: '#666666',
      fontStyle: 'italic',
    },
    skillsText: {
      fontSize: toPx(layout.fontSizePt),
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
            <div key={index} style={{ marginBottom: toPx(layout.itemSpacingPt * 1.5) }}>
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
            <div key={index} style={{ marginBottom: toPx(layout.itemSpacingPt) }}>
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