import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { changePassword } from "../services/userService"; // 🔥 import API đổi mật khẩu

export default function SecuritySupportScreen() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [privacySettings, setPrivacySettings] = useState({
    shareData: false,
    personalized: true,
    locationTracking: true,
  });

  const handlePrivacyToggle = (key: keyof typeof privacySettings) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 🟢 Xử lý đổi mật khẩu qua API
  const handlePasswordChange = async () => {
    if (!currentPass || !newPass || !confirmPass) {
      Alert.alert("Thiếu thông tin", "Vui lòng điền đủ các trường mật khẩu.");
      return;
    }
    if (newPass.length < 6) {
      Alert.alert("Mật khẩu yếu", "Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert("Lỗi xác nhận", "Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      await changePassword(currentPass, newPass);
      Alert.alert("✅ Thành công", "Đổi mật khẩu thành công!");
      setShowPasswordModal(false);
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (err: any) {
      console.log("🧨 Lỗi đổi mật khẩu:", err.message);
      Alert.alert("Lỗi", "Không thể đổi mật khẩu. Vui lòng kiểm tra lại!");
    }
  };

  const handleSendSupport = () => {
    Alert.alert("📨 Đã gửi", "Tin nhắn của bạn đã được gửi!");
    setShowHelpModal(false);
  };

  const sections = [
    {
      title: "Bảo mật",
      items: [
        {
          icon: "lock-closed-outline",
          label: "Đổi mật khẩu",
          onPress: () => setShowPasswordModal(true),
        },
        {
          icon: "shield-checkmark-outline",
          label: "Cài đặt quyền riêng tư",
          onPress: () => setShowPrivacyModal(true),
        },
      ],
    },
    {
      title: "Hỗ trợ",
      items: [
        {
          icon: "help-circle-outline",
          label: "Trung tâm trợ giúp",
          onPress: () => setShowHelpModal(true),
        },
        {
          icon: "document-text-outline",
          label: "Điều khoản & Điều kiện",
          onPress: () => setShowTermsModal(true),
        },
        {
          icon: "document-lock-outline",
          label: "Chính sách bảo mật",
          onPress: () => setShowPolicyModal(true),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bảo mật & Hỗ trợ</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section, sIdx) => (
          <View key={sIdx} style={{ marginBottom: 24 }}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionBox}>
              {section.items.map((item, iIdx) => (
                <TouchableOpacity
                  key={iIdx}
                  style={[
                    styles.itemRow,
                    iIdx !== section.items.length - 1 && styles.itemDivider,
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.itemLeft}>
                    <View style={styles.iconCircle}>
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color="#f97316"
                      />
                    </View>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ---------------- Đổi mật khẩu ---------------- */}
      <Modal visible={showPasswordModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
            <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
              <Ionicons name="close" size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {/* Mật khẩu hiện tại */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Mật khẩu hiện tại</Text>
              <View style={styles.passwordBox}>
                <TextInput
                  secureTextEntry={!showCurrentPass}
                  placeholder="Nhập mật khẩu hiện tại"
                  style={styles.input}
                  value={currentPass}
                  onChangeText={setCurrentPass}
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPass(!showCurrentPass)}
                >
                  <Ionicons
                    name={showCurrentPass ? "eye-off" : "eye"}
                    size={18}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Mật khẩu mới */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Mật khẩu mới</Text>
              <View style={styles.passwordBox}>
                <TextInput
                  secureTextEntry={!showNewPass}
                  placeholder="Nhập mật khẩu mới"
                  style={styles.input}
                  value={newPass}
                  onChangeText={setNewPass}
                />
                <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)}>
                  <Ionicons
                    name={showNewPass ? "eye-off" : "eye"}
                    size={18}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Xác nhận mật khẩu */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
              <View style={styles.passwordBox}>
                <TextInput
                  secureTextEntry={!showConfirmPass}
                  placeholder="Nhập lại mật khẩu"
                  style={styles.input}
                  value={confirmPass}
                  onChangeText={setConfirmPass}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPass(!showConfirmPass)}
                >
                  <Ionicons
                    name={showConfirmPass ? "eye-off" : "eye"}
                    size={18}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 20 }]}
              onPress={handlePasswordChange}
            >
              <Text style={styles.primaryText}>Đổi mật khẩu</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    backgroundColor: "#f97316",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: { marginRight: 8 },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600" },
  content: { padding: 20 },
  sectionTitle: { color: "#6b7280", fontSize: 13, marginBottom: 8 },
  sectionBox: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemDivider: { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconCircle: {
    backgroundColor: "#fff7ed",
    borderRadius: 50,
    padding: 8,
  },
  itemLabel: { color: "#111827", fontSize: 15, fontWeight: "500" },
  modalContainer: { flex: 1, backgroundColor: "white" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  formGroup: { marginBottom: 16 },
  label: { color: "#374151", fontSize: 14, marginBottom: 6 },
  input: {
    flex: 1,
    color: "#111827",
    fontSize: 14,
  },
  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  primaryBtn: {
    backgroundColor: "#f97316",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 14,
  },
  primaryText: { color: "white", fontWeight: "600", fontSize: 15 },
});
