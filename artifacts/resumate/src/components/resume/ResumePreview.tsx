import { ClassicTemplate } from './ClassicTemplate';
import { ModernTemplate } from './ModernTemplate';
import type { ResumeData } from './types';

interface Props {
  data: ResumeData;
  isPrint?: boolean;
}

export function ResumePreview({ data, isPrint }: Props) {
  if (data.template === 'modern') {
    return <ModernTemplate data={data} isPrint={isPrint} />;
  }
  return <ClassicTemplate data={data} isPrint={isPrint} />;
}
