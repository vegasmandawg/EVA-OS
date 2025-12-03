import { DARK_THEME, useTheme } from "@/hooks/use-theme";
import { Image } from "react-native";

export default function Logo() {
  const { theme } = useTheme();

  const source =
    theme === DARK_THEME
      ? require("@/assets/images/logo-dark.png")
      : require("@/assets/images/logo-light.png");

  return (
    <Image
      source={source}
      // 让图片高度占满父容器，宽度会根据宽高比自动调整
      className="h-12 w-12"
      resizeMode="contain"
      accessibilityLabel="App Logo"
    />
  );
}
