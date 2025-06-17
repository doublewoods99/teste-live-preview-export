// Export all templates
export { ClassicTemplate } from './classic/ClassicTemplate';
export { ModernTemplate } from './modern/ModernTemplate';

// Export template configurations
export { classicTemplate, classicTemplateConfig } from './classic/config';
export { modernTemplate, modernTemplateConfig } from './modern/config';

// Re-export template registry utilities
export { 
  templateRegistry,
  getTemplate,
  getAllTemplates,
  getTemplatesByCategory,
  getDefaultTemplateId,
  isValidTemplateId 
} from '../utils/templateRegistry'; 