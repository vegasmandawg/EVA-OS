import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { DARK_THEME, LIGHT_THEME, useTheme } from '@/hooks/use-theme';
import * as Haptics from 'expo-haptics';
import { Moon, Sun } from 'lucide-react-native';

const THEME_TOGGLE_ICONS = {
  light: Sun,
  dark: Moon,
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const newTheme = theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    setTheme(newTheme);
  }

  return (
    <Button
      onPress={toggleTheme}
      variant="ghost"
      size="icon"
      className="size-10 rounded-full flex justify-end">
      <Icon as={THEME_TOGGLE_ICONS[theme]} className="text-foreground" size={24} />
    </Button>
  );
}