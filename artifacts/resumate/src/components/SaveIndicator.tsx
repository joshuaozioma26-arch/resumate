interface Props {
  status: 'idle' | 'saving' | 'saved' | 'error';
}

export function SaveIndicator({ status }: Props) {
  if (status === 'idle') return null;

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium transition-all duration-300">
      {status === 'saving' && (
        <>
          <svg className="animate-spin w-3 h-3 text-indigo-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span className="text-indigo-500">Saving...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-emerald-600">Saved</span>
        </>
      )}
      {status === 'error' && (
        <span className="text-red-500">Save failed</span>
      )}
    </div>
  );
}
