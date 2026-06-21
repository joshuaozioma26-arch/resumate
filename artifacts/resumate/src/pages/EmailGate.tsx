import { useState } from 'react';
import { useLocation } from 'wouter';
import { useLookupResume } from '@workspace/api-client-react';
import { useResumeContext } from '@/context/ResumeContext';
import type { ResumeData } from '@/components/resume/types';

function defaultResumeData(email: string): ResumeData {
  return {
    fullName: '',
    email,
    phone: '',
    location: '',
    website: null,
    linkedin: null,
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
    template: 'classic',
    isPremium: false,
  };
}

export default function EmailGate() {
  const [, navigate] = useLocation();
  const { setEmail, setResumeData } = useResumeContext();
  const [inputEmail, setInputEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const { data, isLoading } = useLookupResume(
    { params: { email: inputEmail } },
    { query: { enabled: submitted && !!inputEmail } }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputEmail.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setEmail(trimmed);
    setInputEmail(trimmed);
    setSubmitted(true);
  };

  if (submitted && !isLoading && data !== undefined) {
    const resume = (data as { resume: unknown }).resume;
    if (resume && typeof resume === 'object' && resume !== null && 'data' in resume) {
      setResumeData((resume as { data: ResumeData }).data);
    } else {
      setResumeData(defaultResumeData(inputEmail));
    }
    navigate('/builder');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 flex flex-col items-center justify-center px-4">
      {/* Logo / Brand */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">ResuMate</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          Build a resume that<br />gets you hired.
        </h1>
        <p className="mt-3 text-gray-500 text-base max-w-sm mx-auto leading-relaxed">
          Enter your email to start building. We'll save your progress automatically so you never lose your work.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={inputEmail}
              onChange={(e) => { setInputEmail(e.target.value); setError(''); setSubmitted(false); }}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              autoFocus
            />
            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading && submitted}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm disabled:opacity-60"
          >
            {isLoading && submitted ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Loading your resume...
              </span>
            ) : 'Start building'}
          </button>
        </form>

        <p className="mt-5 text-xs text-center text-gray-400">
          No password needed. We use your email to save and retrieve your resume.
        </p>
      </div>

      {/* Features */}
      <div className="mt-10 grid grid-cols-3 gap-6 max-w-sm text-center">
        {[
          { icon: '💾', label: 'Auto-saves as you type' },
          { icon: '🎨', label: '2 beautiful templates' },
          { icon: '📄', label: 'Download as PDF' },
        ].map((f) => (
          <div key={f.label} className="text-center">
            <div className="text-2xl mb-1">{f.icon}</div>
            <div className="text-xs text-gray-500 leading-tight">{f.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
