import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { ResumeData } from '@/components/resume/types';

interface ResumeContextType {
  email: string | null;
  setEmail: (email: string | null) => void;
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData | null) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('resumate_email');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleSetEmail = (newEmail: string | null) => {
    setEmail(newEmail);
    if (newEmail) {
      localStorage.setItem('resumate_email', newEmail);
    } else {
      localStorage.removeItem('resumate_email');
    }
  };

  return (
    <ResumeContext.Provider value={{ email, setEmail: handleSetEmail, resumeData, setResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResumeContext() {
  const context = useContext(ResumeContext);
  if (context === undefined) throw new Error('useResumeContext must be used within a ResumeProvider');
  return context;
}
