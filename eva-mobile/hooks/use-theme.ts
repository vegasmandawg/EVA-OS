import { STORAGE_KEYS } from "@/constants/storage-keys";
import AsyncStorage from "@/utils/AsyncStorage";
import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useCallback, useEffect, useState } from "react";
import { Appearance } from "react-native";

type ThemeType = "light" | "dark";
export const LIGHT_THEME = "light";
export const DARK_THEME = "dark";

async function getInitialTheme(): Promise<ThemeType> {
  const cachedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
  if (cachedTheme === DARK_THEME || cachedTheme === LIGHT_THEME) return cachedTheme;
  const system = Appearance.getColorScheme();
  return system === DARK_THEME ? DARK_THEME : LIGHT_THEME;
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeType>(LIGHT_THEME);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const { setColorScheme: setNativewindColorScheme } = useNativewindColorScheme();

  useEffect(() => {
    (async () => {
      const initialTheme = await getInitialTheme();
      setThemeState(initialTheme);
      setNativewindColorScheme(initialTheme);
    })();
  }, [setNativewindColorScheme]);

  useEffect(() => {
    setIsDarkTheme(theme === DARK_THEME);
  }, [theme]);

  useEffect(() => {
    // Only switch theme when the system theme is changed and the user has not set a custom theme
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      AsyncStorage.getItem(STORAGE_KEYS.THEME).then(cachedTheme => {
        if (!cachedTheme) {
          const nextTheme = colorScheme === DARK_THEME ? DARK_THEME : LIGHT_THEME;
          setThemeState(nextTheme);
          setNativewindColorScheme(nextTheme);
        }
      });
    });
    return () => subscription.remove();
  }, [setNativewindColorScheme]);

  const setTheme = useCallback((newTheme: ThemeType) => {
    setThemeState(newTheme);
    setNativewindColorScheme(newTheme);
    AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme);
  }, [setNativewindColorScheme]);

  return { theme, setTheme, isDarkTheme };
}
