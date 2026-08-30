import { useCallback, useEffect, useState } from 'react';

import { healthApi } from '../services/api.js';

export function useHealthCheck() {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const check = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      setData(await healthApi.check());
      setStatus('success');
    } catch (err) {
      setError(err.apiError);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return { status, data, error, retry: check };
}
