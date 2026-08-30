import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'Nothing here yet',
  message,
  icon: Icon = Inbox,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
      <Icon className="h-8 w-8 text-slate-400" />
      <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
      {message ? <p className="mt-1 text-sm text-slate-600">{message}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
