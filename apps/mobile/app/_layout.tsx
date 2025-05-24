import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Appearance, Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { Providers } from "~/providers/providers";
import ToastManager from "toastify-react-native";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

const usePlatformSpecificSetup = Platform.select({
  web: useSetWebBackgroundClassName,
  android: useSetAndroidNavigationBar,
  default: noop,
});

export default function RootLayout() {
  usePlatformSpecificSetup();
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Providers>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Starter Base",
              headerRight: () => <ThemeToggle />,
            }}
          />

          <Stack.Screen
            name="login"
            options={{
              title: "Login",
              headerShown: false,
              headerRight: () => <ThemeToggle />,
              headerStyle: {
                backgroundColor: isDarkColorScheme
                  ? DARK_THEME.colors.background
                  : LIGHT_THEME.colors.background,
              },
            }}
          />

          <Stack.Screen
            name="signup"
            options={{
              title: "Criar conta",
              headerRight: () => <ThemeToggle />,
              headerShown: false,
              headerStyle: {
                backgroundColor: isDarkColorScheme
                  ? DARK_THEME.colors.background
                  : LIGHT_THEME.colors.background,
              },
            }}
          />

          <Stack.Screen
            name="signup-success"
            options={{
              title: "Cadastro realizado",
              headerRight: () => <ThemeToggle />,
              headerShown: false,
              headerStyle: {
                backgroundColor: isDarkColorScheme
                  ? DARK_THEME.colors.background
                  : LIGHT_THEME.colors.background,
              },
            }}
          />

          <Stack.Screen
            name="forgot-password"
            options={{
              title: "Recuperar senha",
              headerRight: () => <ThemeToggle />,
              headerShown: false,
              headerStyle: {
                backgroundColor: isDarkColorScheme
                  ? DARK_THEME.colors.background
                  : LIGHT_THEME.colors.background,
              },
            }}
          />

          <Stack.Screen
            name="forgot-password-success"
            options={{
              title: "Recuperar senha",
              headerRight: () => <ThemeToggle />,
              headerShown: false,
              headerStyle: {
                backgroundColor: isDarkColorScheme
                  ? DARK_THEME.colors.background
                  : LIGHT_THEME.colors.background,
              },
            }}
          />

          <Stack.Screen
            name="(tabs)"
            options={{
              title: "Consiga sua legenda",
              headerShown: false,
              headerRight: () => <ThemeToggle />,
              headerStyle: {
                backgroundColor: isDarkColorScheme
                  ? DARK_THEME.colors.background
                  : LIGHT_THEME.colors.background,
              },
            }}
          />
        </Stack>
        <PortalHost />
        <ToastManager />
      </ThemeProvider>
    </Providers>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;

function useSetWebBackgroundClassName() {
  useIsomorphicLayoutEffect(() => {
    // Adds the background color to the html element to prevent white background on overscroll.
    document.documentElement.classList.add("bg-background");
  }, []);
}

function useSetAndroidNavigationBar() {
  React.useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? "light");
  }, []);
}

function noop() {}
