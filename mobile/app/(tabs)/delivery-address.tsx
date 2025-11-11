import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

interface Address {
  id: number;
  label: string;
  type: "home" | "work" | "other";
  address: string;
  isDefault: boolean;
}

export default function DeliveryAddressScreen() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      label: "Home",
      type: "home",
      address: "123 Main Street, Apartment 4B, New York, NY 10001",
      isDefault: true,
    },
    {
      id: 2,
      label: "Work",
      type: "work",
      address: "456 Business Ave, Floor 12, Suite 1200, New York, NY 10002",
      isDefault: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<"home" | "work" | "other">("home");
  const [newAddress, setNewAddress] = useState("");

  const handleSetDefault = (id: number) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    Alert.alert("✅ Success", "Default address updated");
  };

  const handleDelete = (id: number) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    Alert.alert("🗑️ Deleted", "Address removed successfully");
  };

  const handleAddAddress = () => {
    if (!newLabel.trim() || !newAddress.trim()) {
      Alert.alert("⚠️ Missing info", "Please fill in all fields");
      return;
    }

    const newAddr: Address = {
      id: Date.now(),
      label: newLabel,
      type: newType,
      address: newAddress,
      isDefault: addresses.length === 0,
    };

    setAddresses((prev) => [...prev, newAddr]);
    setNewLabel("");
    setNewAddress("");
    setNewType("home");
    setShowAddForm(false);

    Alert.alert("✅ Success", "Address added successfully");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "home":
        return "home-outline";
      case "work":
        return "briefcase-outline";
      default:
        return "map-outline";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Address</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Add New Button */}
        {!showAddForm && (
          <TouchableOpacity
            onPress={() => setShowAddForm(true)}
            style={styles.addButton}
          >
            <Ionicons name="add-outline" size={20} color="white" />
            <Text style={styles.addButtonText}>Add New Address</Text>
          </TouchableOpacity>
        )}

        {/* Add Form */}
        {showAddForm && (
          <View style={styles.formBox}>
            <Text style={styles.formTitle}>New Address</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Label</Text>
              <TextInput
                value={newLabel}
                onChangeText={setNewLabel}
                placeholder="e.g. Home, Office"
                style={styles.input}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <Text style={styles.label}>Type</Text>
            <View style={styles.typeRow}>
              {(["home", "work", "other"] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setNewType(type)}
                  style={[
                    styles.typeButton,
                    newType === type && styles.typeButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      newType === type && styles.typeTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Address</Text>
              <TextInput
                value={newAddress}
                onChangeText={setNewAddress}
                placeholder="Street, city, state, zip code"
                multiline
                style={[styles.input, { height: 80, textAlignVertical: "top" }]}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                onPress={handleAddAddress}
                style={[styles.flexBtn, { backgroundColor: "#f97316" }]}
              >
                <Text style={[styles.btnText, { color: "white" }]}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowAddForm(false)}
                style={[styles.flexBtn, { backgroundColor: "#f3f4f6" }]}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Address List */}
        {addresses.map((addr) => (
          <View
            key={addr.id}
            style={[
              styles.card,
              addr.isDefault && { borderColor: "#f97316" },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardLeft}>
                <View style={styles.iconCircle}>
                  <Ionicons
                    name={getIcon(addr.type) as any}
                    size={20}
                    color="#f97316"
                  />
                </View>
                <View>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle}>{addr.label}</Text>
                    {addr.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardAddress}>{addr.address}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleDelete(addr.id)}
                style={styles.deleteBtn}
              >
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>

            {!addr.isDefault && (
              <TouchableOpacity
                onPress={() => handleSetDefault(addr.id)}
                style={styles.setDefaultBtn}
              >
                <Text style={styles.setDefaultText}>Set as Default</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Empty State */}
        {addresses.length === 0 && !showAddForm && (
          <View style={styles.emptyBox}>
            <Ionicons name="location-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>No addresses added yet</Text>
            <Text style={styles.emptySubText}>
              Add your first delivery address
            </Text>
          </View>
        )}
      </ScrollView>
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
  backButton: {
    marginRight: 8,
    padding: 6,
    borderRadius: 20,
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600" },

  scrollContent: { padding: 20, paddingBottom: 60 },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f97316",
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
    shadowColor: "#f97316",
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  addButtonText: { color: "white", fontWeight: "600", marginLeft: 6 },

  formBox: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginBottom: 20,
  },
  formTitle: { color: "#111827", fontWeight: "600", fontSize: 16, marginBottom: 12 },
  formGroup: { marginBottom: 12 },
  label: { color: "#374151", fontSize: 13, marginBottom: 6 },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#111827",
    fontSize: 14,
  },

  typeRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  typeButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingVertical: 8,
    marginHorizontal: 2,
    alignItems: "center",
  },
  typeButtonActive: { backgroundColor: "#f97316" },
  typeText: { color: "#6b7280", fontSize: 13, textTransform: "capitalize" },
  typeTextActive: { color: "white", fontWeight: "600" },

  row: { flexDirection: "row", gap: 8 },
  flexBtn: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
  },
  btnText: { fontWeight: "600", color: "#374151" },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#f3f4f6",
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  cardLeft: { flexDirection: "row", gap: 8, flex: 1 },
  iconCircle: {
    backgroundColor: "#fff7ed",
    borderRadius: 20,
    padding: 8,
    marginTop: 2,
  },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardTitle: { color: "#111827", fontWeight: "600", fontSize: 15 },
  cardAddress: { color: "#6b7280", fontSize: 13, marginTop: 2 },
  defaultBadge: {
    backgroundColor: "#ffedd5",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  defaultText: { color: "#ea580c", fontSize: 11, fontWeight: "500" },
  deleteBtn: { padding: 6 },
  setDefaultBtn: {
    borderWidth: 1,
    borderColor: "#f97316",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  setDefaultText: { color: "#f97316", fontWeight: "600", fontSize: 13 },

  emptyBox: { alignItems: "center", marginTop: 40 },
  emptyText: { color: "#6b7280", fontWeight: "500", fontSize: 14 },
  emptySubText: { color: "#9ca3af", fontSize: 12, marginTop: 4 },
});
