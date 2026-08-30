import EmailListItem from './EmailListItem.jsx';

export default function EmailList({ emails }) {
  return (
    <ul className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {emails.map((email) => (
        <EmailListItem key={email.id} email={email} />
      ))}
    </ul>
  );
}
