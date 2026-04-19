import { useEffect } from 'react';
import { useAximStore } from '../store/useAximStore';

export function usePassport() {
  const userSession = useAximStore((state) => state.userSession);
  const loading = useAximStore((state) => state.isSessionLoading);
  const verifyPassport = useAximStore((state) => state.verifyPassport);

  useEffect(() => {
    // Only verify if we haven't loaded yet or if we need to refresh
    if (loading && userSession === null) {
      verifyPassport();
    }
  }, [loading, userSession, verifyPassport]);

  return { userSession, loading };
}
