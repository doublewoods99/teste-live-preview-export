import type { ResumeTemplate } from '../../types/resume';
import { ModernTemplate } from './ModernTemplate';

export const modernTemplateConfig: Omit<ResumeTemplate, 'component'> = {
  id: 'modern',
  name: 'Modern Sidebar',
  description: 'Contemporary two-column layout with sidebar for contact info and skills. Great for creative and tech roles.',
  category: 'modern',
  defaultFormat: {
    fontFamily: 'Arial',
    fontSize: 11,
    lineHeight: 1.5,
    sectionSpacing: 20,
    itemSpacing: 12,
  },
  layout: {
    headerStyle: 'left',
    sectionOrder: ['summary', 'experience'],
    colorScheme: {
      primary: '#4a5568',
      secondary: '#718096',
      text: '#2d3748',
      accent: '#4a5568',
    },
  },
};

export const modernTemplate: ResumeTemplate = {
  ...modernTemplateConfig,
  component: ModernTemplate,
}; 