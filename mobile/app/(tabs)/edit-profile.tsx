import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getProfile, updateProfile } from "../services/userService";

export default function EditProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🟢 Load profile khi mở trang
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
      } catch (err: any) {
        console.log("🧨 Lỗi tải profile:", err.message);
        Alert.alert("Lỗi", "Không thể tải thông tin người dùng!");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // 🟠 Xử lý lưu thông tin
  const handleSave = async () => {
    if (!name || !email || !phone) {
      Alert.alert("Thiếu thông tin", "Vui lòng điền đủ họ tên, email và số điện thoại.");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name, phone });
      Alert.alert("✅ Thành công", "Cập nhật hồ sơ thành công!");
      router.back();
    } catch (err: any) {
      console.log("🧨 Lỗi lưu:", err.message);
      Alert.alert("Lỗi", "Không thể lưu thay đổi, vui lòng thử lại!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar (giữ nguyên - sau này có thể update ảnh sau) */}
        <View style={styles.avatarBox}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={50} color="#f97316" />
            </View>
            <TouchableOpacity style={styles.cameraBtn}>
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarHint}>Chạm để đổi ảnh</Text>
        </View>

        {/* Form */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Họ và tên</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nhập họ và tên"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            editable={false}
            keyboardType="email-address"
            placeholder="Nhập email"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Nhập số điện thoại"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Save & Cancel */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Lưu thay đổi</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#f97316",
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 6,
    marginRight: 8,
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600" },
  content: { padding: 20 },
  avatarBox: { alignItems: "center", marginTop: 12, marginBottom: 20 },
  avatarWrapper: { position: "relative" },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#f97316",
    padding: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  avatarHint: { marginTop: 8, color: "#6b7280", fontSize: 13 },
  formGroup: { marginBottom: 16 },
  label: { color: "#374151", fontWeight: "500", marginBottom: 6 },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    color: "#111827",
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: "#f97316",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#f97316",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginTop: 10,
  },
  saveText: { color: "white", fontWeight: "600", fontSize: 16 },
  cancelBtn: {
    backgroundColor: "white",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 10,
  },
  cancelText: { color: "#374151", fontWeight: "500", fontSize: 15 },
});
