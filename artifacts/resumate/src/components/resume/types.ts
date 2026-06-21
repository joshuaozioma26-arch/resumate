export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string | null;
  linkedin: string | null;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  template: 'classic' | 'modern';
  isPremium: boolean;
}
