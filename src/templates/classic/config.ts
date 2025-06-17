import type { ResumeTemplate } from '../../types/resume';
import { ClassicTemplate } from './ClassicTemplate';

export const classicTemplateConfig: Omit<ResumeTemplate, 'component'> = {
  id: 'classic',
  name: 'Classic Professional',
  description: 'Traditional resume layout with clean lines and professional styling. Perfect for corporate roles and traditional industries.',
  category: 'classic',
  defaultFormat: {
    fontFamily: 'Times New Roman',
    fontSize: 11,
    lineHeight: 1.4,
    sectionSpacing: 18,
    itemSpacing: 10,
  },
  layout: {
    headerStyle: 'centered',
    sectionOrder: ['summary', 'experience', 'education', 'skills'],
    colorScheme: {
      primary: '#333333',
      secondary: '#666666',
      text: '#333333',
      accent: '#333333',
    },
  },
};

export const classicTemplate: ResumeTemplate = {
  ...classicTemplateConfig,
  component: ClassicTemplate,
}; 