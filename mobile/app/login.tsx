import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLogin = () => {
    // TODO: Validate & call API
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sign In</Text>
      </View>

      {/* Main */}
      <View style={styles.main}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🍔</Text>
          </View>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.subText}>Sign in to continue</Text>
        </View>

        {/* Form */}
        <View style={{ gap: 16 }}>
          {/* Email */}
          <View
            style={[
              styles.inputWrapper,
              focusedInput === "email" && styles.inputWrapperFocused,
            ]}
          >
            <View style={styles.iconBox}>
              <Ionicons name="mail" size={20} color="#9ca3af" />
            </View>

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.textInputBox}
              placeholderTextColor="#9ca3af"
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* Password */}
          <View
            style={[
              styles.inputWrapper,
              focusedInput === "password" && styles.inputWrapperFocused,
            ]}
          >
            <View style={styles.iconBox}>
              <Ionicons name="lock-closed" size={20} color="#9ca3af" />
            </View>

            <TextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.textInputBox}
              placeholderTextColor="#9ca3af"
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 4 }}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin} style={styles.signInButton}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={{ alignItems: "center", marginTop: 32 }}>
          <Text style={{ color: "#6b7280" }}>
            Don’t have an account?{" "}
            <Text
              onPress={() => router.push("/register")}
              style={{ color: "#f97316", fontWeight: "600" }}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container tổng
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  main: {
    flex: 1,
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    backgroundColor: "#fed7aa",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 36,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  subText: {
    color: "#6b7280",
  },

  // Input tổng
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden", // bo góc icon + input
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputWrapperFocused: {
    borderColor: "#f97316",
    shadowColor: "#f97316",
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  // Ô chứa icon
  iconBox: {
    width: 48,
    height: 48,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },

  // Ô nhập liệu
  textInputBox: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#111827",
  },

  forgotText: {
    color: "#f97316",
    fontSize: 13,
  },
  signInButton: {
    backgroundColor: "#f97316",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#f97316",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  signInText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
