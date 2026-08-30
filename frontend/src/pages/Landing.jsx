import { Link } from 'react-router-dom';
import { Bot, Mail, ShieldCheck, Sparkles } from 'lucide-react';

import HealthStatus from '../components/common/HealthStatus.jsx';

const features = [
  {
    icon: Mail,
    title: 'Gmail integration',
    description:
      'Read your inbox, open threads, search, and manage messages without leaving the app.',
  },
  {
    icon: Sparkles,
    title: 'AI summaries',
    description:
      'Turn long email threads into a short summary with key points and action items.',
  },
  {
    icon: Bot,
    title: 'AI reply drafts',
    description:
      'Generate a contextual reply draft, pick a tone, then edit it before sending.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by design',
    description:
      'Sign in with Google. Your Gmail password is never requested or stored.',
  },
];

export default function Landing() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Manage your Gmail with AI assistance
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Connect your Google account to read, organize, and reply to real Gmail
          messages, with AI summaries and reply drafts you always review before
          sending.
        </p>
        <Link
          to="/login"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Continue with Google
        </Link>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        {features.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="rounded-lg border border-slate-200 bg-white p-5"
          >
            <Icon className="h-6 w-6 text-blue-600" />
            <h2 className="mt-3 font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </article>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          System status
        </h2>
        <HealthStatus />
      </section>
    </div>
  );
}
