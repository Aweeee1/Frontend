import { useEffect, useRef, useState } from "react";
import { api } from "@/api/client";

export function useApiResource<T>(path: string, fallback: T) {
  // Keep the latest fallback without making it an effect dependency
  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setData(fallbackRef.current); // don't show the previous path's data while loading
    api
      .get<T>(path)
      .then((response) => {
        if (active) setData(response.data);
      })
      .catch((requestError: Error) => {
        if (active) setError(`${requestError.message}. Showing seeded demonstration data.`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [path]);

  return { data, loading, error };
}
