import React, { useState } from "react";
import { Stack } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import WelcomeScreen from "./welcome";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome) {
    return <WelcomeScreen onNavigate={() => setShowWelcome(false)} />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Login1" }} />
        <Stack.Screen name="register" options={{ title: "Register" }} />
      </Stack>
    </ThemeProvider>
  );
}
