import { useCallback, useEffect, useState } from 'react';

export function useAsync(asyncFn, deps = []) {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(asyncFn, deps);

  const execute = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      setData(await run());
      setStatus('success');
    } catch (err) {
      setError(err.apiError || { message: 'Something went wrong.' });
      setStatus('error');
    }
  }, [run]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { status, data, error, retry: execute, setData };
}
