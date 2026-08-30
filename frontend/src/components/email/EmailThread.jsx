import EmailMessage from './EmailMessage.jsx';

export default function EmailThread({ thread }) {
  const lastIndex = thread.messages.length - 1;

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <header className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-slate-900">{thread.subject}</h2>
        <p className="text-xs text-slate-500">
          {thread.messageCount} message{thread.messageCount === 1 ? '' : 's'}
        </p>
      </header>

      {thread.messages.map((message, index) => (
        <EmailMessage
          key={message.id}
          message={message}
          defaultExpanded={index === lastIndex}
        />
      ))}
    </section>
  );
}
