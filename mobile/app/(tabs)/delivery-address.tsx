import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/addressService";

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

export default function DeliveryAddressScreen() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  // 🟢 Load danh sách địa chỉ từ backend
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const data = await getAddresses();
        setAddresses(data);
      } catch (err: any) {
        console.log("🧨 Lỗi tải địa chỉ:", err.message);
        Alert.alert("Lỗi", "Không thể tải danh sách địa chỉ!");
      } finally {
        setLoading(false);
      }
    };
    loadAddresses();
  }, []);

  // 🟡 Thêm địa chỉ mới
  const handleAddAddress = async () => {
    if (!fullName || !phone || !addressLine || !city || !district || !ward) {
      Alert.alert("Thiếu thông tin", "Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      await addAddress({
        fullName,
        phone,
        addressLine,
        city,
        district,
        ward,
        isDefault: addresses.length === 0,
      });
      Alert.alert("✅ Thành công", "Đã thêm địa chỉ mới!");
      setShowAddForm(false);
      setFullName("");
      setPhone("");
      setAddressLine("");
      setCity("");
      setDistrict("");
      setWard("");
      const refreshed = await getAddresses();
      setAddresses(refreshed);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể thêm địa chỉ!");
    }
  };

  // 🔴 Xóa địa chỉ
  const handleDelete = async (id: string) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa địa chỉ này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAddress(id);
            const refreshed = await getAddresses();
            setAddresses(refreshed);
          } catch {
            Alert.alert("Lỗi", "Không thể xóa địa chỉ!");
          }
        },
      },
    ]);
  };

  // 🟢 Set địa chỉ mặc định
  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      Alert.alert("✅ Thành công", "Đã đặt làm địa chỉ mặc định!");
      const refreshed = await getAddresses();
      setAddresses(refreshed);

      // 🔙 Quay về checkout nếu chọn default trong lúc thanh toán
      router.back();
    } catch {
      Alert.alert("Lỗi", "Không thể đặt mặc định!");
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa chỉ giao hàng</Text>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Nút thêm mới */}
        {!showAddForm && (
          <TouchableOpacity
            onPress={() => setShowAddForm(true)}
            style={styles.addButton}
          >
            <Ionicons name="add-outline" size={20} color="white" />
            <Text style={styles.addButtonText}>Thêm địa chỉ mới</Text>
          </TouchableOpacity>
        )}

        {/* Form thêm địa chỉ */}
        {showAddForm && (
          <View
            key={showAddForm ? "form-visible" : "form-hidden"}
            style={styles.formBox}
          >
            <Text style={styles.formTitle}>Thêm địa chỉ mới</Text>

            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Họ và tên"
              style={styles.input}
            />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              style={styles.input}
            />
            <TextInput
              value={addressLine}
              onChangeText={setAddressLine}
              placeholder="Địa chỉ (Số nhà, tên đường)"
              style={styles.input}
            />
            <TextInput
              value={ward}
              onChangeText={setWard}
              placeholder="Phường/Xã"
              style={styles.input}
            />
            <TextInput
              value={district}
              onChangeText={setDistrict}
              placeholder="Quận/Huyện"
              style={styles.input}
            />
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Tỉnh/Thành phố"
              style={styles.input}
            />

            <View style={styles.row}>
              <TouchableOpacity
                onPress={handleAddAddress}
                style={[styles.flexBtn, { backgroundColor: "#f97316" }]}
              >
                <Text style={[styles.btnText, { color: "white" }]}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowAddForm(false)}
                style={[styles.flexBtn, { backgroundColor: "#f3f4f6" }]}
              >
                <Text style={styles.btnText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Danh sách địa chỉ */}
        {addresses.map((addr) => (
          <View
            key={addr._id}
            style={[styles.card, addr.isDefault && { borderColor: "#f97316" }]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardLeft}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color="#f97316"
                  style={{ marginTop: 4 }}
                />
                <View style={{ flex: 1 }}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle}>{addr.fullName}</Text>
                    {addr.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>Mặc định</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardAddress}>
                    {addr.addressLine}, {addr.ward}, {addr.district},{" "}
                    {addr.city}
                  </Text>
                  <Text style={styles.cardPhone}>{addr.phone}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleDelete(addr._id)}
                style={styles.deleteBtn}
              >
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>

            {!addr.isDefault && (
              <TouchableOpacity
                onPress={() => handleSetDefault(addr._id)}
                style={styles.setDefaultBtn}
              >
                <Text style={styles.setDefaultText}>Đặt làm mặc định</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Nếu chưa có địa chỉ */}
        {addresses.length === 0 && !showAddForm && (
          <View style={styles.emptyBox}>
            <Ionicons name="location-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>Chưa có địa chỉ nào</Text>
            <Text style={styles.emptySubText}>
              Hãy thêm địa chỉ giao hàng mới
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#f97316",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backButton: { marginRight: 8, padding: 6, borderRadius: 20 },
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
  formTitle: { fontWeight: "600", fontSize: 16, marginBottom: 12 },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#111827",
    fontSize: 14,
    marginBottom: 10,
  },
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
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardTitle: { color: "#111827", fontWeight: "600", fontSize: 15 },
  cardAddress: { color: "#6b7280", fontSize: 13, marginTop: 2 },
  cardPhone: { color: "#9ca3af", fontSize: 12, marginTop: 2 },
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
