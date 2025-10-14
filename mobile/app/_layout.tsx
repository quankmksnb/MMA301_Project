import React from "react";
import { Stack } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        initialRouteName="welcome" // ✅ Bắt đầu bằng màn hình welcome
        screenOptions={{
          headerShown: false, // Ẩn header mặc định
          animation: "slide_from_right", // ✅ Hiệu ứng chuyển cảnh mượt
          gestureEnabled: true, // Cho phép vuốt để quay lại
        }}
      >
        {/* Màn hình chào */}
        <Stack.Screen name="welcome" />

        {/* Auth stack */}
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="register" options={{ title: "Register" }} />

        {/* Màn hình chính có Tab */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
