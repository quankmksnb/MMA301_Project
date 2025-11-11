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

export default function SecuritySupportScreen() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [privacySettings, setPrivacySettings] = useState({
    shareData: false,
    personalized: true,
    locationTracking: true,
  });

  const handlePrivacyToggle = (key: keyof typeof privacySettings) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePasswordChange = () => {
    Alert.alert("✅ Success", "Password changed successfully!");
    setShowPasswordModal(false);
  };

  const handleSendSupport = () => {
    Alert.alert("📨 Sent", "Your message has been sent!");
    setShowHelpModal(false);
  };

  const sections = [
    {
      title: "Security",
      items: [
        {
          icon: "lock-closed-outline",
          label: "Change Password",
          onPress: () => setShowPasswordModal(true),
        },
        {
          icon: "shield-checkmark-outline",
          label: "Privacy Settings",
          onPress: () => setShowPrivacyModal(true),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: "help-circle-outline",
          label: "Help Center",
          onPress: () => setShowHelpModal(true),
        },
        {
          icon: "document-text-outline",
          label: "Terms & Conditions",
          onPress: () => setShowTermsModal(true),
        },
        {
          icon: "document-lock-outline",
          label: "Privacy Policy",
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
        <Text style={styles.headerTitle}>Security & Support</Text>
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

      {/* ---------------- Password Modal ---------------- */}
      <Modal visible={showPasswordModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
              <Ionicons name="close" size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.passwordBox}>
                <TextInput
                  secureTextEntry={!showCurrentPass}
                  placeholder="Enter current password"
                  style={styles.input}
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

            <View style={styles.formGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordBox}>
                <TextInput
                  secureTextEntry={!showNewPass}
                  placeholder="Enter new password"
                  style={styles.input}
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

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordBox}>
                <TextInput
                  secureTextEntry={!showConfirmPass}
                  placeholder="Confirm password"
                  style={styles.input}
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
              <Text style={styles.primaryText}>Change Password</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ---------------- Privacy Modal ---------------- */}
      <Modal visible={showPrivacyModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Privacy Settings</Text>
            <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
              <Ionicons name="close" size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          <View style={{ padding: 20 }}>
            {Object.entries(privacySettings).map(([key, val]) => (
              <View
                key={key}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <View>
                  <Text style={styles.label}>
                    {key === "shareData"
                      ? "Share Data with Partners"
                      : key === "personalized"
                      ? "Personalized Experience"
                      : "Location Tracking"}
                  </Text>
                  <Text style={styles.subText}>
                    {key === "shareData"
                      ? "Allow us to share anonymized data"
                      : key === "personalized"
                      ? "Get recommendations based on your activity"
                      : "Allow location for better delivery"}
                  </Text>
                </View>
                <Switch
                  trackColor={{ false: "#d1d5db", true: "#fb923c" }}
                  thumbColor="#fff"
                  value={val}
                  onValueChange={() =>
                    handlePrivacyToggle(key as keyof typeof privacySettings)
                  }
                />
              </View>
            ))}

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 10 }]}
              onPress={() => {
                Alert.alert("✅ Saved", "Privacy settings saved");
                setShowPrivacyModal(false);
              }}
            >
              <Text style={styles.primaryText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* ---------------- Help Modal ---------------- */}
      <Modal visible={showHelpModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Help Center</Text>
            <TouchableOpacity onPress={() => setShowHelpModal(false)}>
              <Ionicons name="close" size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput style={styles.input} placeholder="Your name" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Your email"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.input, { height: 100 }]}
                multiline
                placeholder="How can we help you?"
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 10 }]}
              onPress={handleSendSupport}
            >
              <Text style={styles.primaryText}>Send Message</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ---------------- Terms Modal ---------------- */}
      <Modal visible={showTermsModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Terms & Conditions</Text>
            <TouchableOpacity onPress={() => setShowTermsModal(false)}>
              <Ionicons name="close" size={22} color="#111827" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.subText}>
              By using our service, you agree to:
            </Text>
            <Text style={styles.listItem}>
              • You must be at least 18 years old.
            </Text>
            <Text style={styles.listItem}>
              • We may update our terms anytime.
            </Text>
            <Text style={styles.listItem}>
              • Violations may lead to account termination.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ---------------- Policy Modal ---------------- */}
      <Modal visible={showPolicyModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Privacy Policy</Text>
            <TouchableOpacity onPress={() => setShowPolicyModal(false)}>
              <Ionicons name="close" size={22} color="#111827" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.subText}>
              We collect and store data to improve our services:
            </Text>
            <Text style={styles.listItem}>
              • Your personal info is securely stored.
            </Text>
            <Text style={styles.listItem}>
              • We never share your data without consent.
            </Text>
            <Text style={styles.listItem}>
              • You can request data deletion anytime.
            </Text>
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

  // Modal styles
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
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#111827",
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
  subText: { color: "#6b7280", fontSize: 13, marginBottom: 8 },
  listItem: { color: "#6b7280", fontSize: 13, marginBottom: 6 },
});
