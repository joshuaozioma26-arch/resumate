import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useResumeContext } from '@/context/ResumeContext';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { GoPremiumModal } from '@/components/GoPremiumModal';
import { useState } from 'react';
import type { ResumeData } from '@/components/resume/types';

export default function Preview() {
  const [, navigate] = useLocation();
  const { resumeData, email } = useResumeContext();
  const [premiumOpen, setPremiumOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!email) navigate('/');
  }, [email, navigate]);

  if (!resumeData) {
    navigate('/');
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Toolbar */}
      <div className="no-print sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/builder')}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to editor
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setPremiumOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-900 text-xs font-semibold rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Go Premium
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Free tier notice */}
      {!resumeData.isPremium && (
        <div className="no-print bg-amber-50 border-b border-amber-100 px-4 py-2.5 text-center text-xs text-amber-700">
          Free version includes a "Made with ResuMate" footer.{' '}
          <button onClick={() => setPremiumOpen(true)} className="font-semibold underline hover:text-amber-900">
            Go Premium
          </button>{' '}
          to remove it.
        </div>
      )}

      {/* Resume document */}
      <div className="flex-1 flex items-start justify-center p-6 sm:p-12">
        <div
          ref={printRef}
          id="resume-print-root"
          className="w-full max-w-[780px] bg-white shadow-2xl"
          style={{ minHeight: '1060px' }}
        >
          <ResumePreview data={resumeData} isPrint />
        </div>
      </div>

      <GoPremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
    </div>
  );
}
