import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
      <span>{message}</span>
    </div>
  );
}
