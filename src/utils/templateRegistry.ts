import type { ResumeTemplate } from '../types/resume';
import { classicTemplate } from '../templates/classic/config';
import { modernTemplate } from '../templates/modern/config';

// Template registry - central place to manage all templates
export const templateRegistry: Map<string, ResumeTemplate> = new Map([
  [classicTemplate.id, classicTemplate],
  [modernTemplate.id, modernTemplate],
]);

// Helper functions for template management
export const getTemplate = (templateId: string): ResumeTemplate | undefined => {
  return templateRegistry.get(templateId);
};

export const getAllTemplates = (): ResumeTemplate[] => {
  return Array.from(templateRegistry.values());
};

export const getTemplatesByCategory = (category: string): ResumeTemplate[] => {
  return getAllTemplates().filter(template => template.category === category);
};

export const getDefaultTemplateId = (): string => {
  return classicTemplate.id; // Default to classic template
};

export const isValidTemplateId = (templateId: string): boolean => {
  return templateRegistry.has(templateId);
}; 