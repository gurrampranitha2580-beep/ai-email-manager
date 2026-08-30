import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onSearch, onClear, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [field, setField] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();

    if (trimmed) {
      onSearch({ q: trimmed, field });
    }
  };

  const clear = () => {
    setQuery('');
    setField('');
    onClear();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search your Gmail..."
          aria-label="Search emails"
          className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <select
        value={field}
        onChange={(event) => setField(event.target.value)}
        aria-label="Search field"
        className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      >
        <option value="">Anywhere</option>
        <option value="from">From</option>
        <option value="to">To</option>
        <option value="subject">Subject</option>
      </select>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Search
        </button>
        {initialQuery ? (
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        ) : null}
      </div>
    </form>
  );
}
