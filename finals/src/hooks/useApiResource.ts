import { useEffect, useState } from "react";
import { api } from "@/api/client";

export function useApiResource<T>(path: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get<T>(path)
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
