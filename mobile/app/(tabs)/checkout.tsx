import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { CartItem, products } from "../data/mockData";

export default function CheckoutScreen() {
  // 🧠 Dữ liệu test (lấy từ mockData)
  const [cartItems] = useState<CartItem[]>([
    { ...products[0], quantity: 1 },
    { ...products[2], quantity: 2 },
  ]);

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "vnpay" | "momo">(
    "cash"
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    router.replace("/(tabs)/orders"); // Chuyển sang trang Orders
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🏠 Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="location-outline" size={20} color="#f97316" />
            </View>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <TextInput
            placeholder="Enter your delivery address"
            style={styles.input}
            defaultValue="123 Main Street, Apt 4B"
          />
        </View>

        {/* 🚚 Delivery Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="car-outline" size={20} color="#f97316" />
            </View>
            <Text style={styles.sectionTitle}>Delivery Method</Text>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.deliveryBtn, styles.deliveryActive]}>
              <Text style={styles.deliveryTextActive}>Standard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deliveryBtn}>
              <Text style={styles.deliveryText}>Express</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 💳 Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="card-outline" size={20} color="#f97316" />
            </View>
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>

          {[
            { key: "cash", label: "💵 Cash on Delivery" },
            { key: "vnpay", label: "💳 VNPay" },
            { key: "momo", label: "📱 Momo" },
          ].map((method) => (
            <TouchableOpacity
              key={method.key}
              onPress={() => setPaymentMethod(method.key as any)}
              style={[
                styles.paymentOption,
                paymentMethod === method.key && styles.paymentActive,
              ]}
            >
              <Text
                style={[
                  styles.paymentText,
                  paymentMethod === method.key && styles.paymentTextActive,
                ]}
              >
                {method.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 📦 Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.textGray}>Subtotal</Text>
            <Text style={styles.textGray}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.textGray}>Delivery Fee</Text>
            <Text style={styles.textGray}>${deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.textDark}>Total</Text>
            <Text style={styles.totalText}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* ✅ Bottom Button */}
      <View style={styles.bottomBox}>
        <TouchableOpacity
          onPress={handlePlaceOrder}
          style={styles.placeOrderBtn}
        >
          <Text style={styles.placeOrderText}>
            Place Order - ${total.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  backBtn: { marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  scrollContent: { padding: 20, paddingBottom: 120, gap: 20 },

  section: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconCircle: {
    backgroundColor: "#ffedd5",
    borderRadius: 20,
    padding: 6,
    marginRight: 8,
  },
  sectionTitle: { color: "#111827", fontWeight: "600", fontSize: 15 },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  row: { flexDirection: "row", gap: 10 },
  deliveryBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  deliveryActive: {
    borderColor: "#f97316",
    backgroundColor: "#fff7ed",
  },
  deliveryText: { color: "#6b7280", fontWeight: "500" },
  deliveryTextActive: { color: "#f97316", fontWeight: "600" },
  paymentOption: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  paymentActive: {
    borderColor: "#f97316",
    backgroundColor: "#fff7ed",
  },
  paymentText: { color: "#374151", fontWeight: "500" },
  paymentTextActive: { color: "#f97316", fontWeight: "600" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
    marginTop: 4,
  },
  textGray: { color: "#6b7280" },
  textDark: { color: "#111827", fontWeight: "600" },
  totalText: { color: "#f97316", fontWeight: "700" },

  bottomBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  placeOrderBtn: {
    backgroundColor: "#f97316",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  placeOrderText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
