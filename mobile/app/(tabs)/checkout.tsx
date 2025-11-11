import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getDefaultAddress } from "../services/addressService";
import { getCart, checkoutCart } from "../services/cartService";

const BIDV_ACCOUNT = "4831020728"; // 👈 thay bằng tài khoản BIDV thật

export default function CheckoutScreen() {
  const [address, setAddress] = useState<any>(null);
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "PAYPAL">("COD");
  const [showQR, setShowQR] = useState(false);

  // 🟢 Load default address & cart tổng tiền
  useEffect(() => {
    const fetchData = async () => {
      try {
        const addr = await getDefaultAddress();
        const cartData = await getCart();
        setAddress(addr);
        setCart(cartData);
      } catch (err: any) {
        console.log("Lỗi khi load dữ liệu:", err.message);
        Alert.alert(
          "Thiếu thông tin",
          "Hãy thêm địa chỉ giao hàng trước khi thanh toán!",
          [{ text: "Đến địa chỉ", onPress: () => router.push("/(tabs)/delivery-address") }]
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPrice = cart?.totalPrice || 0;
  const totalPriceVND = totalPrice.toLocaleString("vi-VN");
  const qrUrl = `https://img.vietqr.io/image/BIDV-${BIDV_ACCOUNT}-compact2.png?amount=${totalPrice}&addInfo=Thanh+toan+don+hang`;

  const handleCheckout = async () => {
    if (!address) {
      Alert.alert("Thiếu địa chỉ", "Vui lòng thêm địa chỉ trước khi thanh toán!");
      return;
    }

    if (paymentMethod === "COD") {
      try {
        await checkoutCart(address._id, "COD");
        Alert.alert("Thành công", "Đơn hàng của bạn đã được tạo!", [
          { text: "Xem đơn hàng", onPress: () => router.push("/(tabs)/orders") },
        ]);
      } catch (err) {
        Alert.alert("Lỗi", "Không thể tạo đơn hàng!");
      }
    } else {
      setShowQR(true); // show mã QR để user quét
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
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Địa chỉ */}
        <View style={styles.section}>
          <View style={styles.rowHeader}>
            <Ionicons name="location-outline" size={20} color="#f97316" />
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          </View>
          {address ? (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/delivery-address")}
            >
              <Text style={styles.addressName}>{address.fullName}</Text>
              <Text style={styles.addressText}>{address.phone}</Text>
              <Text style={styles.addressText}>
                {address.addressLine}, {address.ward}, {address.district}, {address.city}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addAddressBtn}
              onPress={() => router.push("/(tabs)/delivery-address")}
            >
              <Text style={styles.addAddressText}>+ Thêm địa chỉ</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Phương thức thanh toán */}
        <View style={styles.section}>
          <View style={styles.rowHeader}>
            <Ionicons name="card-outline" size={20} color="#f97316" />
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          </View>
          {[
            { key: "COD", label: "💵 Thanh toán khi nhận hàng" },
            { key: "PAYPAL", label: "🏦 Chuyển khoản VietQR (BIDV)" },
          ].map((m) => (
            <TouchableOpacity
              key={m.key}
              style={[
                styles.paymentOption,
                paymentMethod === m.key && styles.paymentActive,
              ]}
              onPress={() => setPaymentMethod(m.key as any)}
            >
              <Text
                style={[
                  styles.paymentText,
                  paymentMethod === m.key && styles.paymentTextActive,
                ]}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tổng cộng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tổng tiền</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.textGray}>Tổng cộng</Text>
            <Text style={styles.totalText}>₫{totalPriceVND}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Nút thanh toán */}
      <View style={styles.bottomBox}>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Thanh toán - ₫{totalPriceVND}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal QR */}
      <Modal visible={showQR} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.qrTitle}>Quét mã VietQR để thanh toán</Text>
            <Image source={{ uri: qrUrl }} style={{ width: 260, height: 260, margin: 12 }} />
            <Text style={styles.qrAmount}>Số tiền: ₫{totalPriceVND}</Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowQR(false)}
            >
              <Text style={styles.closeText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    backgroundColor: "white",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  scroll: { padding: 16, paddingBottom: 140 },
  section: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  rowHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 6 },
  sectionTitle: { fontWeight: "600", fontSize: 15, color: "#111827" },
  addressName: { fontWeight: "600", fontSize: 16, color: "#111827" },
  addressText: { color: "#4b5563", marginTop: 2 },
  addAddressBtn: {
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#f97316",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addAddressText: { color: "#f97316", fontWeight: "600" },
  paymentOption: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  paymentActive: { borderColor: "#f97316", backgroundColor: "#fff7ed" },
  paymentText: { color: "#374151" },
  paymentTextActive: { color: "#f97316", fontWeight: "600" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  textGray: { color: "#6b7280" },
  totalText: { fontWeight: "700", color: "#f97316", fontSize: 16 },
  bottomBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
  },
  checkoutBtn: {
    backgroundColor: "#f97316",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutText: { color: "white", fontWeight: "600", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
    width: 320,
  },
  qrTitle: { fontWeight: "600", fontSize: 16, marginBottom: 6 },
  qrAmount: { color: "#111827", fontWeight: "500" },
  closeBtn: {
    backgroundColor: "#f97316",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  closeText: { color: "white", fontWeight: "600" },
});
