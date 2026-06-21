import type { ResumeData } from './types';

interface Props {
  data: ResumeData;
  isPrint?: boolean;
}

function formatDate(date: string | null | undefined, current?: boolean): string {
  if (current) return 'Present';
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function ClassicTemplate({ data, isPrint }: Props) {
  const fontSize = isPrint ? 'text-[10pt]' : 'text-[9px] sm:text-[10px]';
  const nameSize = isPrint ? 'text-[20pt]' : 'text-[18px] sm:text-[22px]';
  const sectionSize = isPrint ? 'text-[11pt]' : 'text-[10px] sm:text-[12px]';

  return (
    <div
      className={`bg-white font-serif ${fontSize} leading-relaxed text-gray-900 p-8 min-h-full`}
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      {/* Header */}
      <div className="text-center mb-5 pb-4 border-b-2 border-gray-800">
        <h1 className={`${nameSize} font-bold tracking-wide uppercase text-gray-900`}>
          {data.fullName || 'Your Name'}
        </h1>
        <div className={`mt-1.5 flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-gray-600 ${isPrint ? 'text-[9pt]' : 'text-[8px] sm:text-[9px]'}`}>
          {data.email && <span>{data.email}</span>}
          {data.phone && <><span className="text-gray-400">|</span><span>{data.phone}</span></>}
          {data.location && <><span className="text-gray-400">|</span><span>{data.location}</span></>}
          {data.linkedin && <><span className="text-gray-400">|</span><span>{data.linkedin}</span></>}
          {data.website && <><span className="text-gray-400">|</span><span>{data.website}</span></>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-4">
          <h2 className={`${sectionSize} font-bold uppercase tracking-widest text-gray-800 mb-1.5 border-b border-gray-400 pb-0.5`}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {data.workExperience.length > 0 && (
        <div className="mb-4">
          <h2 className={`${sectionSize} font-bold uppercase tracking-widest text-gray-800 mb-2 border-b border-gray-400 pb-0.5`}>
            Experience
          </h2>
          {data.workExperience.map((job) => (
            <div key={job.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-gray-900">{job.role || 'Role'}</span>
                  {job.company && <span className="text-gray-700">, {job.company}</span>}
                </div>
                <span className={`text-gray-500 whitespace-nowrap ml-2 ${isPrint ? 'text-[8pt]' : 'text-[8px]'}`}>
                  {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                </span>
              </div>
              {job.description && (
                <p className="mt-1 text-gray-700 leading-relaxed">{job.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-4">
          <h2 className={`${sectionSize} font-bold uppercase tracking-widest text-gray-800 mb-2 border-b border-gray-400 pb-0.5`}>
            Education
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-gray-900">{edu.institution || 'Institution'}</span>
                </div>
                <span className={`text-gray-500 whitespace-nowrap ml-2 ${isPrint ? 'text-[8pt]' : 'text-[8px]'}`}>
                  {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                </span>
              </div>
              <div className="text-gray-700">
                {[edu.degree, edu.field].filter(Boolean).join(' in ')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-4">
          <h2 className={`${sectionSize} font-bold uppercase tracking-widest text-gray-800 mb-1.5 border-b border-gray-400 pb-0.5`}>
            Skills
          </h2>
          <p className="text-gray-700">{data.skills.join(' · ')}</p>
        </div>
      )}

      {/* Watermark footer */}
      {!data.isPremium && (
        <div className={`mt-6 pt-3 border-t border-gray-200 text-center text-gray-400 ${isPrint ? 'text-[7pt]' : 'text-[7px]'}`}>
          Made with ResuMate — resumate.app
        </div>
      )}
    </div>
  );
}
