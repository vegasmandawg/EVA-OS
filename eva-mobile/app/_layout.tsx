import CustomHeader from "@/components/custom-header";
import { DARK_THEME, useTheme } from "@/hooks/use-theme";
import { registerGlobals } from "@livekit/react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "../global.css";

SplashScreen.setOptions({
  duration: 1500,
  fade: true,
});

export const unstable_settings = {
  anchor: "(tabs)",
};

registerGlobals();

export default function RootLayout() {
  const { theme } = useTheme();

  return (
    <SafeAreaProvider>
      {/* <SafeAreaView> */}
        <ThemeProvider value={theme === DARK_THEME ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: "#DAD0EC" },
              headerTintColor: "#7A7080",
              headerBackVisible: false,
              headerBackButtonMenuEnabled: false,
              headerShadowVisible: false,
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="index/index"
              options={{
                header: () => (
                  <CustomHeader title="Welcome" showBackButton={false} />
                ),
              }}
            />
            {/* <Stack.Screen
          name="index"
          options={{ headerShown: false, title: "Home" }}
        /> */}
            {/* <Stack.Screen name="settings" options={{ title: "Settings" }} /> */}
            <Stack.Screen
              name="chat/[solutionKey]/index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <StatusBar style="auto" />
          <PortalHost />
          <Toast />
        </ThemeProvider>
      {/* </SafeAreaView> */}
    </SafeAreaProvider>
  );
}
