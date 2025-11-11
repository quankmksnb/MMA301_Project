import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { registerUser } from "./services/authService";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🟠 Xử lý đăng ký
  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirm) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường!");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Lỗi", "Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser({
        name: fullName,
        email,
        password,
      });

      Alert.alert(
        "Đăng ký thành công",
        "Mã xác thực đã được gửi đến email của bạn!",
        [
          {
            text: "Xác minh ngay",
            onPress: () =>
              router.push({
                pathname: "/verify",
                params: { email },
              }),
          },
        ]
      );
    } catch (error: any) {
      console.log("Register error:", error.response?.data || error.message);
      const msg =
        error.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng thử lại!";
      Alert.alert("Lỗi đăng ký", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Tạo tài khoản</Text>
      </View>

      {/* Main */}
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🍔</Text>
          </View>
          <Text style={styles.welcomeText}>Tham gia Foodify</Text>
          <Text style={styles.subText}>Tạo tài khoản để bắt đầu nhé</Text>
        </View>

        {/* Form */}
        <View style={{ gap: 16 }}>
          {/* Họ và tên */}
          <View
            style={[
              styles.inputWrapper,
              focusedInput === "name" && styles.inputWrapperFocused,
            ]}
          >
            <View style={styles.iconBox}>
              <Ionicons name="person" size={20} color="#9ca3af" />
            </View>
            <TextInput
              placeholder="Họ và tên"
              value={fullName}
              onChangeText={setFullName}
              style={styles.textInputBox}
              placeholderTextColor="#9ca3af"
              onFocus={() => setFocusedInput("name")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

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

          {/* Mật khẩu */}
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
              placeholder="Mật khẩu"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.textInputBox}
              placeholderTextColor="#9ca3af"
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* Nhập lại mật khẩu */}
          <View
            style={[
              styles.inputWrapper,
              focusedInput === "confirm" && styles.inputWrapperFocused,
            ]}
          >
            <View style={styles.iconBox}>
              <Ionicons name="lock-closed" size={20} color="#9ca3af" />
            </View>
            <TextInput
              placeholder="Nhập lại mật khẩu"
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
              style={styles.textInputBox}
              placeholderTextColor="#9ca3af"
              onFocus={() => setFocusedInput("confirm")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* Nút đăng ký */}
          <TouchableOpacity
            onPress={handleRegister}
            style={styles.registerButton}
            disabled={loading}
          >
            <Text style={styles.registerText}>
              {loading ? "Đang xử lý..." : "Tạo tài khoản"}
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={{ alignItems: "center", marginTop: 24 }}>
            <Text style={{ color: "#6b7280" }}>
              Đã có tài khoản?{" "}
              <Text
                onPress={() => router.push("/login")}
                style={{ color: "#f97316", fontWeight: "600" }}
              >
                Đăng nhập
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputWrapperFocused: {
    borderColor: "#f97316",
    shadowColor: "#f97316",
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  iconBox: {
    width: 48,
    height: 48,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  textInputBox: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#111827",
  },
  registerButton: {
    backgroundColor: "#f97316",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#f97316",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  registerText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
