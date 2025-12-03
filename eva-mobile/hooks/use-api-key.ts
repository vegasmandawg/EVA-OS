import { getCachedApiKey, setCachedApiKey } from "@/lib/auth";
import { useCallback, useEffect, useState } from "react";

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState("");

  useEffect(() => {
    const loadSolutionKey = async () => {
      const cachedSolutionKey = await getCachedApiKey();
      setApiKeyState(cachedSolutionKey);
    };
    loadSolutionKey();
  }, []);

  const setApiKey = useCallback(async (value: string) => {
    setApiKeyState(value);
    await setCachedApiKey(value);
  }, [setApiKeyState]);

  return { apiKey, setApiKey };
}