import React from "react";
import { View, StyleSheet } from "react-native";
import { Slot, useRouter, usePathname } from "expo-router";
import { BottomNav } from "@/components/BottomNav";
import { CartProvider, useCart } from "../context/CartContext";

export default function CustomTabLayout() {
  return (
    <CartProvider>
      <TabLayoutInner />
    </CartProvider>
  );
}

// ⬇️ phần bên dưới là layout chính thật
function TabLayoutInner() {
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount } = useCart();

  const activeScreen = (() => {
    if (pathname.endsWith("/cart")) return "cart";
    if (pathname.endsWith("/orders")) return "orders";
    if (pathname.endsWith("/profile")) return "profile";
    return "home";
  })();

  const handleNavigate = (screen: string) => {
    switch (screen) {
      case "home":
        router.push("/(tabs)");
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
      <View style={styles.content}>
        <Slot />
      </View>
      <BottomNav
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        cartCount={cartCount} // 🟢 Lấy trực tiếp từ Context
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, paddingBottom: 60 },
});
