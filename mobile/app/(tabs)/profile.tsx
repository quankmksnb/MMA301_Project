import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function ProfileScreen() {
  const userName = "John Doe";
  const userEmail = "john@example.com";

  const handleLogout = () => {
    router.replace("/login");
  };

  const menuItems = [
    { icon: "person-outline", label: "Edit Profile", action: () => {} },
    { icon: "bag-outline", label: "My Orders", action: () => router.push("/(tabs)/orders") },
    { icon: "location-outline", label: "Delivery Address", action: () => {} },
    { icon: "heart-outline", label: "Favorites", action: () => {} },
    { icon: "settings-outline", label: "Settings", action: () => {} },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#fb923c", "#f97316"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Profile</Text>

        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={38} color="#f97316" />
          </View>
          <View>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={item.action}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconCircle}>
                  <Ionicons name={item.icon as any} size={20} color="#f97316" />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Foodify v1.0.0</Text>
          <Text style={[styles.footerText, { marginTop: 2 }]}>Made with QuanNM</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  userInfo: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatar: {
    width: 70,
    height: 70,
    backgroundColor: "white",
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  userName: { color: "white", fontSize: 20, fontWeight: "600" },
  userEmail: { color: "rgba(255,255,255,0.9)", fontSize: 13 },
  content: { paddingHorizontal: 20, marginTop: 40, paddingBottom: 40 },
  menuContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconCircle: {
    backgroundColor: "#fff7ed",
    padding: 8,
    borderRadius: 50,
  },
  menuLabel: { color: "#374151", fontSize: 15 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 20,
    paddingVertical: 14,
    marginTop: 20,
  },
  logoutText: { color: "#ef4444", fontWeight: "600", fontSize: 15 },
  footer: { alignItems: "center", marginTop: 24 },
  footerText: { color: "#6b7280", fontSize: 13 },
});
