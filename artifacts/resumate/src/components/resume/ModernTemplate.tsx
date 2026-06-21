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

export function ModernTemplate({ data, isPrint }: Props) {
  const fontSize = isPrint ? 'text-[10pt]' : 'text-[9px] sm:text-[10px]';
  const nameSize = isPrint ? 'text-[22pt]' : 'text-[20px] sm:text-[24px]';
  const sectionSize = isPrint ? 'text-[9pt]' : 'text-[8px] sm:text-[9px]';

  return (
    <div
      className={`bg-white font-sans ${fontSize} leading-relaxed text-gray-800 min-h-full`}
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Header strip */}
      <div className="bg-indigo-700 text-white px-8 py-6">
        <h1 className={`${nameSize} font-bold tracking-tight leading-tight`}>
          {data.fullName || 'Your Name'}
        </h1>
        <div className={`mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-indigo-200 ${isPrint ? 'text-[8pt]' : 'text-[8px] sm:text-[9px]'}`}>
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.website && <span>{data.website}</span>}
        </div>
      </div>

      <div className="px-8 py-5">
        {/* Summary */}
        {data.summary && (
          <div className="mb-5">
            <h2 className={`${sectionSize} font-bold uppercase tracking-[0.15em] text-indigo-600 mb-2`}>
              About
            </h2>
            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
          </div>
        )}

        <div className="flex gap-6">
          {/* Main column */}
          <div className="flex-1 min-w-0">
            {/* Work Experience */}
            {data.workExperience.length > 0 && (
              <div className="mb-5">
                <h2 className={`${sectionSize} font-bold uppercase tracking-[0.15em] text-indigo-600 mb-3 flex items-center gap-2`}>
                  <span>Experience</span>
                  <span className="flex-1 h-px bg-indigo-100"></span>
                </h2>
                {data.workExperience.map((job) => (
                  <div key={job.id} className="mb-4 pl-3 border-l-2 border-indigo-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-900 leading-tight">{job.role || 'Role'}</div>
                        <div className="text-indigo-600 font-medium">{job.company}</div>
                      </div>
                      <span className={`text-gray-400 whitespace-nowrap ml-2 shrink-0 ${isPrint ? 'text-[8pt]' : 'text-[8px]'}`}>
                        {formatDate(job.startDate)} – {job.current ? 'Present' : formatDate(job.endDate)}
                      </span>
                    </div>
                    {job.description && (
                      <p className="mt-1.5 text-gray-600 leading-relaxed">{job.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <div className="mb-4">
                <h2 className={`${sectionSize} font-bold uppercase tracking-[0.15em] text-indigo-600 mb-3 flex items-center gap-2`}>
                  <span>Education</span>
                  <span className="flex-1 h-px bg-indigo-100"></span>
                </h2>
                {data.education.map((edu) => (
                  <div key={edu.id} className="mb-3 pl-3 border-l-2 border-indigo-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-900">{edu.institution || 'Institution'}</div>
                        <div className="text-gray-600">{[edu.degree, edu.field].filter(Boolean).join(' in ')}</div>
                      </div>
                      <span className={`text-gray-400 whitespace-nowrap ml-2 shrink-0 ${isPrint ? 'text-[8pt]' : 'text-[8px]'}`}>
                        {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills sidebar */}
          {data.skills.length > 0 && (
            <div className={`shrink-0 ${isPrint ? 'w-32' : 'w-28 sm:w-36'}`}>
              <h2 className={`${sectionSize} font-bold uppercase tracking-[0.15em] text-indigo-600 mb-3`}>
                Skills
              </h2>
              <div className="flex flex-col gap-1">
                {data.skills.map((skill, i) => (
                  <div key={i} className="bg-indigo-50 text-indigo-800 rounded px-2 py-0.5 text-center font-medium">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Watermark footer */}
        {!data.isPremium && (
          <div className={`mt-6 pt-3 border-t border-gray-100 text-center text-gray-300 ${isPrint ? 'text-[7pt]' : 'text-[7px]'}`}>
            Made with ResuMate — resumate.app
          </div>
        )}
      </div>
    </div>
  );
}
