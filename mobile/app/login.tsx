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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { loginUser } from "./services/authService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ email và mật khẩu!");
    return;
  }

  try {
    const res = await loginUser(email, password);
    const { token, user } = res;

    await AsyncStorage.setItem("accessToken", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));

    Alert.alert("Đăng nhập thành công", `Chào mừng ${user.name || "bạn"}!`);
    router.replace("/(tabs)");
  } catch (error: any) {
    console.log("Lỗi đăng nhập:", error?.response?.data || error.message);

    if (error?.response) {
      const status = error.response.status;
      const msg = error.response.data.message;

      if (status === 404 || msg?.includes("not found")) {
        Alert.alert("Đăng nhập thất bại", "Email không tồn tại trong hệ thống!");
      } else if (status === 400 && msg?.includes("Invalid credentials")) {
        Alert.alert("Đăng nhập thất bại", "Mật khẩu không chính xác. Vui lòng thử lại!");
      } else if (status === 403 && msg?.includes("not verified")) {
        Alert.alert("Tài khoản chưa kích hoạt", "Vui lòng kiểm tra email để xác thực tài khoản.");
      } else {
        Alert.alert("Đăng nhập thất bại", msg || "Đã xảy ra lỗi, vui lòng thử lại!");
      }
    } else {
      Alert.alert("Lỗi mạng", "Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng!");
    }
  }
};



  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Đăng nhập</Text>
      </View>

      {/* Main */}
      <View style={styles.main}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🍔</Text>
          </View>
          <Text style={styles.welcomeText}>Chào mừng bạn</Text>
          <Text style={styles.subText}>Đăng nhập để tiếp tục</Text>
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

          <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 4 }}>
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin} style={styles.signInButton}>
            <Text style={styles.signInText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={{ alignItems: "center", marginTop: 32 }}>
          <Text style={{ color: "#6b7280" }}>
            Bạn chưa có tài khoản?{" "}
            <Text
              onPress={() => router.push("/register")}
              style={{ color: "#f97316", fontWeight: "600" }}
            >
              Đăng ký
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
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
