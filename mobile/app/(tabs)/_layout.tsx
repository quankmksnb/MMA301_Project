import React from "react";
import { View, StyleSheet } from "react-native";
import { Slot, useRouter, usePathname } from "expo-router";
import { BottomNav } from "@/components/BottomNav";

// Đây là layout cho toàn bộ tab, giữ UI BottomNav gốc của bạn
export default function CustomTabLayout() {
  const router = useRouter();
  const pathname = usePathname();

  // Xác định tab đang active dựa vào đường dẫn hiện tại
  const activeScreen = (() => {
    if (pathname.endsWith("/cart")) return "cart";
    if (pathname.endsWith("/orders")) return "orders";
    if (pathname.endsWith("/profile")) return "profile";
    return "home";
  })();

  // Khi người dùng bấm icon trong BottomNav
  const handleNavigate = (screen: string) => {
    switch (screen) {
      case "home":
        router.push("/(tabs)"); // index.tsx
        break;
      case "cart":
        router.push("/(tabs)/cart");
        break;
      case "orders":
        router.push("/(tabs)/orders");
        break;
      case "profile":
        router.push("/(tabs)/profile");
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Slot giúp Expo Router render đúng page */}
      <View style={styles.content}>
        <Slot />
      </View>

      {/* Giữ nguyên giao diện BottomNav bạn đã thiết kế */}
      <BottomNav
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        cartCount={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, paddingBottom: 60 },
});
