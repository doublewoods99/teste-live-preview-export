export interface ResumeContent {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
}

export interface ResumeFormat {
  fontFamily: 'Arial' | 'Georgia' | 'Times New Roman';
  fontSize: number;
  lineHeight: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  pageSize: 'A4' | 'Letter';
  sectionSpacing: number;
  itemSpacing: number;
}

export interface ResumeSchema {
  content: ResumeContent;
  format: ResumeFormat;
}

// Template system interfaces
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'classic' | 'modern' | 'creative' | 'technical';
  
  // Template-specific rendering component
  component: React.ComponentType<{ resume: ResumeSchema }>;
  
  // Default format settings for this template
  defaultFormat: Partial<ResumeFormat>;
  
  // Template-specific styling/layout configuration
  layout: {
    headerStyle: 'centered' | 'left' | 'right' | 'split';
    sectionOrder: string[];
    colorScheme: {
      primary: string;
      secondary: string;
      text: string;
      accent: string;
    };
  };
} 