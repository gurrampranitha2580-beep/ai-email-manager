export default function PagePlaceholder({ title, description, children }) {
  return (
    <section className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      {description ? (
        <p className="mt-2 text-slate-600">{description}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}
