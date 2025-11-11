import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { resendOtp, verifyOtp } from "./services/authService";

export default function VerifyScreen() {
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleVerify = async () => {
    const otp = code.join("");
    if (otp.length !== 6) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ 6 chữ số!");
      return;
    }
    try {
      setLoading(true);
      await verifyOtp(email as string, otp);
      Alert.alert("Thành công", "Xác thực tài khoản thành công!");
      router.replace("/login");
    } catch (error: any) {
      console.log("Verify error:", error.response?.data);
      const msg = error.response?.data?.message || "Mã OTP không hợp lệ!";
      Alert.alert("Lỗi xác thực", msg);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      setLoading(true);
      await resendOtp(email as string);
      Alert.alert("Đã gửi lại mã", "Vui lòng kiểm tra email của bạn!");
      setTimer(60);
      setCanResend(false);
      setCode(["", "", "", "", "", ""]);
    } catch {
      Alert.alert("Lỗi", "Không thể gửi lại mã. Thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Xác minh tài khoản</Text>
      </View>

      {/* Main */}
      <View style={styles.main}>
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Ionicons name="mail" size={48} color="#f97316" />
          <Text style={styles.title}>Nhập mã xác thực</Text>
          <Text style={styles.desc}>Mã 6 chữ số đã được gửi đến:</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* OTP Inputs */}
        <View style={styles.otpRow}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) {
                  inputRefs.current[index] = ref;
                }
              }}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(val) => handleChange(index, val)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.verifyBtn}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.verifyText}>
            {loading ? "Đang xác minh..." : "Xác minh"}
          </Text>
        </TouchableOpacity>

        <View style={{ alignItems: "center", marginTop: 16 }}>
          {!canResend ? (
            <Text style={{ color: "#6b7280" }}>
              Gửi lại mã sau <Text style={{ color: "#f97316" }}>{timer}s</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={{ color: "#f97316", fontWeight: "600" }}>
                Gửi lại mã
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
  },
  headerText: { fontSize: 18, fontWeight: "600", color: "#111827" },
  main: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: "700", marginTop: 8 },
  desc: { color: "#6b7280", marginTop: 4 },
  email: { color: "#f97316", fontWeight: "600", marginTop: 4 },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 20,
    color: "#111827",
  },
  verifyBtn: {
    backgroundColor: "#f97316",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 32,
  },
  verifyText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
