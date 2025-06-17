import { create } from 'zustand';
import type { ResumeSchema, ResumeContent, ResumeFormat } from '../types/resume';
import { defaultResumeSchema } from '../utils/schema/defaultSchema';
import { getDefaultTemplateId, getTemplate, isValidTemplateId } from '../utils/templateRegistry';

interface ResumeStore {
  resume: ResumeSchema;
  selectedTemplateId: string;
  updateContent: (content: Partial<ResumeContent>) => void;
  updateFormat: (format: Partial<ResumeFormat>) => void;
  updatePersonalInfo: (personalInfo: Partial<ResumeContent['personalInfo']>) => void;
  updateSummary: (summary: string) => void;
  setTemplate: (templateId: string) => void;
  resetToDefault: () => void;
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resume: defaultResumeSchema,
  selectedTemplateId: getDefaultTemplateId(),
  
  updateContent: (content) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          ...content,
        },
      },
    })),
  
  updateFormat: (format) =>
    set((state) => ({
      resume: {
        ...state.resume,
        format: {
          ...state.resume.format,
          ...format,
        },
      },
    })),
  
  updatePersonalInfo: (personalInfo) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          personalInfo: {
            ...state.resume.content.personalInfo,
            ...personalInfo,
          },
        },
      },
    })),
  
  updateSummary: (summary) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          summary,
        },
      },
    })),

  setTemplate: (templateId) => {
    if (!isValidTemplateId(templateId)) {
      console.warn(`Invalid template ID: ${templateId}`);
      return;
    }
    
    const template = getTemplate(templateId);
    if (!template) {
      console.warn(`Template not found: ${templateId}`);
      return;
    }

    set((state) => ({
      selectedTemplateId: templateId,
      resume: {
        ...state.resume,
        format: {
          ...state.resume.format,
          ...template.defaultFormat,
        },
      },
    }));
  },
  
  resetToDefault: () => set({ 
    resume: defaultResumeSchema,
    selectedTemplateId: getDefaultTemplateId(),
  }),
})); 