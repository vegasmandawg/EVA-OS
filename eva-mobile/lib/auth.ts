import { STORAGE_KEYS } from "@/constants/storage-keys";
import AsyncStorage from "@/utils/AsyncStorage";

export async function getCachedApiKey() {
  const cachedSolutionKey = await AsyncStorage.getItem(STORAGE_KEYS.API_KEY);
  return cachedSolutionKey || "";
}

export async function setCachedApiKey(solutionKey: string) {
  await AsyncStorage.setItem(STORAGE_KEYS.API_KEY, solutionKey);
}