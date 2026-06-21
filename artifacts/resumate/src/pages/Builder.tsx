import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { useSaveResume } from '@workspace/api-client-react';
import { useResumeContext } from '@/context/ResumeContext';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { SaveIndicator } from '@/components/SaveIndicator';
import { GoPremiumModal } from '@/components/GoPremiumModal';
import type { ResumeData, WorkExperience, Education } from '@/components/resume/types';
const uuidv4 = () => crypto.randomUUID();

function defaultData(email: string): ResumeData {
  return {
    fullName: '', email, phone: '', location: '', website: null, linkedin: null,
    summary: '', workExperience: [], education: [], skills: [], template: 'classic', isPremium: false,
  };
}

function SectionHeader({ title, onAdd, addLabel }: { title: string; onAdd?: () => void; addLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      {onAdd && (
        <button onClick={onAdd} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {addLabel || 'Add'}
        </button>
      )}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-gray-600 mb-1">{children}</label>;
}

function TextInput({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder-gray-300"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder-gray-300 resize-none"
    />
  );
}

export default function Builder() {
  const [, navigate] = useLocation();
  const { email, resumeData, setResumeData } = useResumeContext();
  const [data, setData] = useState<ResumeData>(resumeData ?? defaultData(email ?? ''));
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [skillInput, setSkillInput] = useState('');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveResume = useSaveResume();

  useEffect(() => {
    if (!email) navigate('/');
  }, [email, navigate]);

  const triggerSave = useCallback((d: ResumeData) => {
    if (!email) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await saveResume.mutateAsync({ data: { email, data: d } });
        setResumeData(d);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2500);
      } catch {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    }, 1500);
  }, [email, saveResume, setResumeData]);

  const update = (patch: Partial<ResumeData>) => {
    const next = { ...data, ...patch };
    setData(next);
    triggerSave(next);
  };

  // Work Experience
  const addJob = () => {
    const job: WorkExperience = { id: uuidv4(), company: '', role: '', startDate: '', endDate: null, current: false, description: '' };
    update({ workExperience: [...data.workExperience, job] });
  };
  const updateJob = (id: string, patch: Partial<WorkExperience>) => {
    update({ workExperience: data.workExperience.map(j => j.id === id ? { ...j, ...patch } : j) });
  };
  const removeJob = (id: string) => update({ workExperience: data.workExperience.filter(j => j.id !== id) });

  // Education
  const addEdu = () => {
    const edu: Education = { id: uuidv4(), institution: '', degree: '', field: '', startDate: '', endDate: null, current: false };
    update({ education: [...data.education, edu] });
  };
  const updateEdu = (id: string, patch: Partial<Education>) => {
    update({ education: data.education.map(e => e.id === id ? { ...e, ...patch } : e) });
  };
  const removeEdu = (id: string) => update({ education: data.education.filter(e => e.id !== id) });

  // Skills
  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !data.skills.includes(s)) update({ skills: [...data.skills, s] });
    setSkillInput('');
  };
  const removeSkill = (skill: string) => update({ skills: data.skills.filter(s => s !== skill) });

  const formContent = (
    <div className="space-y-6 pb-8">
      {/* Contact Info */}
      <section>
        <SectionHeader title="Contact Information" />
        <div className="space-y-3">
          <div>
            <FieldLabel>Full Name</FieldLabel>
            <TextInput value={data.fullName} onChange={v => update({ fullName: v })} placeholder="Jane Smith" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Email</FieldLabel>
              <TextInput value={data.email} onChange={v => update({ email: v })} placeholder="jane@example.com" type="email" />
            </div>
            <div>
              <FieldLabel>Phone</FieldLabel>
              <TextInput value={data.phone} onChange={v => update({ phone: v })} placeholder="+1 555 0100" />
            </div>
          </div>
          <div>
            <FieldLabel>Location</FieldLabel>
            <TextInput value={data.location} onChange={v => update({ location: v })} placeholder="San Francisco, CA" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>LinkedIn</FieldLabel>
              <TextInput value={data.linkedin ?? ''} onChange={v => update({ linkedin: v || null })} placeholder="linkedin.com/in/jane" />
            </div>
            <div>
              <FieldLabel>Website</FieldLabel>
              <TextInput value={data.website ?? ''} onChange={v => update({ website: v || null })} placeholder="janesmith.com" />
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Summary */}
      <section>
        <SectionHeader title="Professional Summary" />
        <Textarea
          value={data.summary}
          onChange={v => update({ summary: v })}
          placeholder="Experienced software engineer with 5+ years building scalable web applications..."
          rows={4}
        />
      </section>

      <hr className="border-gray-100" />

      {/* Work Experience */}
      <section>
        <SectionHeader title="Work Experience" onAdd={addJob} addLabel="Add job" />
        {data.workExperience.length === 0 && (
          <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-4 text-center border border-dashed border-gray-200">
            No work experience added yet. Click "Add job" to get started.
          </div>
        )}
        <div className="space-y-4">
          {data.workExperience.map((job) => (
            <div key={job.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Position</span>
                <button onClick={() => removeJob(job.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Job Title</FieldLabel>
                  <TextInput value={job.role} onChange={v => updateJob(job.id, { role: v })} placeholder="Senior Engineer" />
                </div>
                <div>
                  <FieldLabel>Company</FieldLabel>
                  <TextInput value={job.company} onChange={v => updateJob(job.id, { company: v })} placeholder="Acme Corp" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Start Date</FieldLabel>
                  <input
                    type="month"
                    value={job.startDate}
                    onChange={e => updateJob(job.id, { startDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                  />
                </div>
                <div>
                  <FieldLabel>End Date</FieldLabel>
                  {job.current ? (
                    <div className="px-3 py-2 text-sm text-gray-400 bg-gray-100 rounded-lg border border-gray-200">Present</div>
                  ) : (
                    <input
                      type="month"
                      value={job.endDate ?? ''}
                      onChange={e => updateJob(job.id, { endDate: e.target.value || null })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                    />
                  )}
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={job.current}
                  onChange={e => updateJob(job.id, { current: e.target.checked, endDate: e.target.checked ? null : job.endDate })}
                  className="rounded accent-indigo-600"
                />
                I currently work here
              </label>
              <div>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  value={job.description}
                  onChange={v => updateJob(job.id, { description: v })}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Education */}
      <section>
        <SectionHeader title="Education" onAdd={addEdu} addLabel="Add education" />
        {data.education.length === 0 && (
          <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-4 text-center border border-dashed border-gray-200">
            No education added yet. Click "Add education" to get started.
          </div>
        )}
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div key={edu.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Degree</span>
                <button onClick={() => removeEdu(edu.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div>
                <FieldLabel>Institution</FieldLabel>
                <TextInput value={edu.institution} onChange={v => updateEdu(edu.id, { institution: v })} placeholder="Stanford University" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Degree</FieldLabel>
                  <TextInput value={edu.degree} onChange={v => updateEdu(edu.id, { degree: v })} placeholder="B.S." />
                </div>
                <div>
                  <FieldLabel>Field of Study</FieldLabel>
                  <TextInput value={edu.field} onChange={v => updateEdu(edu.id, { field: v })} placeholder="Computer Science" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Start Date</FieldLabel>
                  <input
                    type="month"
                    value={edu.startDate}
                    onChange={e => updateEdu(edu.id, { startDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                  />
                </div>
                <div>
                  <FieldLabel>End Date</FieldLabel>
                  {edu.current ? (
                    <div className="px-3 py-2 text-sm text-gray-400 bg-gray-100 rounded-lg border border-gray-200">Present</div>
                  ) : (
                    <input
                      type="month"
                      value={edu.endDate ?? ''}
                      onChange={e => updateEdu(edu.id, { endDate: e.target.value || null })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                    />
                  )}
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={edu.current}
                  onChange={e => updateEdu(edu.id, { current: e.target.checked, endDate: e.target.checked ? null : edu.endDate })}
                  className="rounded accent-indigo-600"
                />
                Currently enrolled
              </label>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Skills */}
      <section>
        <SectionHeader title="Skills" />
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
              placeholder="Type a skill and press Enter"
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all placeholder-gray-300"
            />
            <button
              onClick={() => addSkill(skillInput)}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Add
            </button>
          </div>
          {data.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {data.skills.map(skill => (
                <span key={skill} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1.5 rounded-full border border-indigo-100">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="text-indigo-400 hover:text-indigo-700 transition-colors ml-0.5">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Top navbar */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900">ResuMate</span>
        </div>

        <div className="flex items-center gap-3">
          <SaveIndicator status={saveStatus} />

          {/* Template toggle */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1 gap-1">
            {(['classic', 'modern'] as const).map(t => (
              <button
                key={t}
                onClick={() => update({ template: t })}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                  data.template === t
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/preview')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview & Download
          </button>

          <button
            onClick={() => setPremiumOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-900 text-xs font-semibold rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Go Premium
          </button>
        </div>
      </header>

      {/* Mobile tabs */}
      <div className="sm:hidden flex border-b border-gray-100 bg-white shrink-0">
        {(['form', 'preview'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors ${
              activeTab === tab
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-400'
            }`}
          >
            {tab === 'form' ? 'Edit' : 'Preview'}
          </button>
        ))}
      </div>

      {/* Main split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form panel */}
        <div className={`sm:flex flex-col w-full sm:w-[420px] lg:w-[480px] shrink-0 bg-white border-r border-gray-100 overflow-y-auto ${activeTab === 'form' ? 'flex' : 'hidden'}`}>
          <div className="px-5 pt-5">
            {formContent}
          </div>
        </div>

        {/* Preview panel */}
        <div className={`sm:flex flex-col flex-1 bg-gray-100 overflow-auto ${activeTab === 'preview' ? 'flex' : 'hidden'}`}>
          {/* Mobile template toggle */}
          <div className="sm:hidden flex gap-2 p-3 justify-center">
            <div className="flex items-center bg-white rounded-lg p-1 gap-1 border border-gray-100 shadow-sm">
              {(['classic', 'modern'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => update({ template: t })}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                    data.template === t ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-start justify-center p-4 sm:p-8">
            <div className="w-full max-w-[680px] bg-white shadow-2xl rounded-sm overflow-hidden" style={{ minHeight: '900px' }}>
              <ResumePreview data={data} />
            </div>
          </div>

          {/* Mobile download button */}
          <div className="sm:hidden p-4 bg-white border-t border-gray-100">
            <button
              onClick={() => navigate('/preview')}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <GoPremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
    </div>
  );
}
