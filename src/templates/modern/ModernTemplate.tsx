import React from 'react';
import type { ResumeSchema } from '../../types/resume';
import { calculateLayoutMeasurements } from '../../utils/layout/measurements';

interface ModernTemplateProps {
  resume: ResumeSchema;
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({ resume }) => {
  const layout = calculateLayoutMeasurements(resume.format);

  // Convert pt measurements to pixels for web display
  const toPx = (pt: number) => `${pt * 1.35}px`;

  const styles = {
    container: {
      display: 'flex',
      width: '100%',
      fontFamily: resume.format.fontFamily === 'Times New Roman' ? 'Times, serif' : 
                  resume.format.fontFamily === 'Georgia' ? 'Times, serif' : 
                  'Arial, Helvetica, sans-serif',
      fontSize: toPx(layout.fontSizePt),
      lineHeight: 1.4,
      color: '#2d3748',
      position: 'relative' as const,
      height: `${layout.pageHeightPt * 1.35}px`,
    },
    sidebar: {
      backgroundColor: '#4a5568',
      color: '#ffffff',
      padding: `${toPx(layout.marginTopPt)} ${toPx(layout.marginRightPt)} ${toPx(layout.marginBottomPt)} ${toPx(layout.marginLeftPt)}`,
      width: '35%',
      minHeight: `${layout.pageHeightPt * 1.35}px`,
      boxSizing: 'border-box' as const,
      overflow: 'hidden',
      position: 'absolute' as const,
      top: 0,
      left: 0,
    },
    mainContent: {
      padding: `${toPx(layout.marginTopPt)} ${toPx(layout.marginRightPt)} ${toPx(layout.marginBottomPt)} ${toPx(layout.marginLeftPt)}`,
      width: '65%',
      height: '100%',
      boxSizing: 'border-box' as const,
      marginLeft: '35%',
    },
    header: {
      marginBottom: toPx(layout.sectionSpacingPt),
    },
    name: {
      fontSize: toPx(layout.fontSizePt * 1.6),
      fontWeight: '700',
      marginBottom: toPx(layout.lineHeightPt * 0.5),
      color: '#ffffff',
      margin: 0,
    },
    title: {
      fontSize: toPx(layout.fontSizePt * 1.1),
      marginBottom: toPx(layout.lineHeightPt),
      color: '#e2e8f0',
      margin: 0,
      fontWeight: '300',
    },
    contact: {
      fontSize: toPx(layout.fontSizePt * 0.9),
      color: '#e2e8f0',
      marginTop: toPx(layout.itemSpacingPt),
    },
    contactItem: {
      marginBottom: toPx(layout.itemSpacingPt * 0.5),
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    sidebarSection: {
      marginBottom: toPx(layout.sectionSpacingPt),
    },
    sidebarSectionTitle: {
      fontSize: toPx(layout.fontSizePt * 1.1),
      fontWeight: '700',
      marginBottom: toPx(layout.itemSpacingPt),
      color: '#e2e8f0',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      borderBottom: '2px solid #718096',
      paddingBottom: '4px',
    },
    skillsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: toPx(layout.itemSpacingPt * 0.5),
    },
    skill: {
      fontSize: toPx(layout.fontSizePt * 0.9),
      color: '#e2e8f0',
      padding: '4px 8px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '4px',
      textAlign: 'center' as const,
    },
    section: {
      marginBottom: toPx(layout.sectionSpacingPt),
    },
    sectionTitle: {
      fontSize: toPx(layout.fontSizePt * 1.3),
      fontWeight: '700',
      marginBottom: toPx(layout.itemSpacingPt),
      color: '#4a5568',
      borderLeft: '4px solid #4a5568',
      paddingLeft: toPx(layout.itemSpacingPt),
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
    },
    jobHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: toPx(layout.itemSpacingPt * 0.5),
    },
    jobTitle: {
      fontSize: toPx(layout.fontSizePt * 1.1),
      fontWeight: '600',
      color: '#2d3748',
    },
    company: {
      fontSize: toPx(layout.fontSizePt),
      color: '#4a5568',
      fontWeight: '500',
    },
    jobDate: {
      fontSize: toPx(layout.fontSizePt * 0.9),
      color: '#718096',
      textAlign: 'right' as const,
      fontStyle: 'italic',
    },
    bulletList: {
      margin: 0,
      paddingLeft: '20px',
    },
    bulletItem: {
      fontSize: toPx(layout.fontSizePt),
      marginBottom: toPx(layout.itemSpacingPt * 0.3),
      color: '#2d3748',
      lineHeight: 1.5,
    },
    eduHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: toPx(layout.itemSpacingPt * 0.3),
    },
    eduTitle: {
      fontSize: toPx(layout.fontSizePt * 1.05),
      fontWeight: '600',
      color: '#2d3748',
    },
    eduDate: {
      fontSize: toPx(layout.fontSizePt * 0.9),
      color: '#718096',
      fontStyle: 'italic',
    },
    eduDetails: {
      fontSize: toPx(layout.fontSizePt * 0.95),
      color: '#4a5568',
    },
  };

  return (
    <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.name}>{resume.content.personalInfo.name}</h1>
            {resume.content.personalInfo.title && (
              <p style={styles.title}>{resume.content.personalInfo.title}</p>
            )}
          </div>

          {/* Contact Info */}
          <div style={styles.sidebarSection}>
            <h2 style={styles.sidebarSectionTitle}>Contact</h2>
            <div style={styles.contact}>
              <div style={styles.contactItem}>
                <span>📧</span>
                <span>{resume.content.personalInfo.email}</span>
              </div>
              <div style={styles.contactItem}>
                <span>📱</span>
                <span>{resume.content.personalInfo.phone}</span>
              </div>
              <div style={styles.contactItem}>
                <span>📍</span>
                <span>{resume.content.personalInfo.location}</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          {resume.content.skills.length > 0 && (
            <div style={styles.sidebarSection}>
              <h2 style={styles.sidebarSectionTitle}>Skills</h2>
              <div style={styles.skillsGrid}>
                {resume.content.skills.map((skill, index) => (
                  <div key={index} style={styles.skill}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education in Sidebar */}
          {resume.content.education.length > 0 && (
            <div style={styles.sidebarSection}>
              <h2 style={styles.sidebarSectionTitle}>Education</h2>
              {resume.content.education.map((edu, index) => (
                <div key={index} style={{ marginBottom: toPx(layout.itemSpacingPt) }}>
                  <div style={{ ...styles.eduTitle, color: '#e2e8f0', fontSize: toPx(layout.fontSizePt) }}>
                    {edu.degree}
                  </div>
                  <div style={{ ...styles.eduDetails, color: '#cbd5e0', fontSize: toPx(layout.fontSizePt * 0.9) }}>
                    {edu.field}
                  </div>
                  <div style={{ ...styles.eduDetails, color: '#cbd5e0', fontSize: toPx(layout.fontSizePt * 0.85) }}>
                    {edu.school}
                  </div>
                  <div style={{ ...styles.eduDate, color: '#a0aec0', fontSize: toPx(layout.fontSizePt * 0.8) }}>
                    {edu.graduationDate} {edu.gpa && `• GPA: ${edu.gpa}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Professional Summary */}
          {resume.content.summary && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>About Me</h2>
              <p style={{ margin: 0, lineHeight: 1.6, color: '#4a5568' }}>{resume.content.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {resume.content.experience.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Experience</h2>
              {resume.content.experience.map((job, index) => (
                <div key={index} style={{ marginBottom: toPx(layout.itemSpacingPt * 1.5) }}>
                  <div style={styles.jobHeader}>
                    <div>
                      <div style={styles.jobTitle}>{job.position}</div>
                      <div style={styles.company}>{job.company}</div>
                    </div>
                    <div style={styles.jobDate}>
                      {job.startDate} - {job.current ? 'Present' : job.endDate}
                    </div>
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
        </div>
      </div>
  );
}; 