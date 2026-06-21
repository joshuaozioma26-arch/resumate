import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function GoPremiumModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <span className="w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center text-white text-sm font-bold">★</span>
            Go Premium
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Upgrade to ResuMate Premium and take your resume to the next level.
          </p>
          <ul className="space-y-2">
            {[
              'Remove the "Made with ResuMate" watermark',
              'Unlock additional professional templates',
              'Priority PDF rendering',
              'Unlimited resume versions',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-indigo-500 mt-0.5 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="bg-indigo-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-indigo-700">Coming Soon</div>
            <div className="text-xs text-indigo-500 mt-1">Premium pricing will be announced shortly</div>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
