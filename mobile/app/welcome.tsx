import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router"; // ✅ dùng router thay vì navigation

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={["#fb923c", "#facc15"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {/* Decorative circles */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🍔</Text>
          </View>
          <Text style={styles.title}>Foodify</Text>
          {/* <Text style={styles.subtitle}>Order your favorite food</Text> */}
        </View>

        {/* Food illustration */}
        <Text style={styles.emoji}>🍕</Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.loginBtn]}
            onPress={() => router.push("/login")} // ✅ chuyển sang dùng router
          >
            <Text style={[styles.buttonText, { color: "#f97316" }]}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.registerBtn]}
            onPress={() => router.push("/register")} // ✅ tương tự
          >
            <Text style={[styles.buttonText, { color: "white" }]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  circle: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
  },
  circle1: {
    width: 120,
    height: 120,
    top: 100,
    left: 40,
  },
  circle2: {
    width: 160,
    height: 160,
    bottom: 120,
    right: 30,
  },
  content: {
    alignItems: "center",
    zIndex: 10,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  logoEmoji: {
    fontSize: 60,
  },
  title: {
    fontSize: 48,
    color: "white",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
  },
  emoji: {
    fontSize: 72,
    marginBottom: 50,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  loginBtn: {
    backgroundColor: "white",
  },
  registerBtn: {
    backgroundColor: "#ea580c",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
