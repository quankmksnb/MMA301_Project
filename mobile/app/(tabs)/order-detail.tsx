import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { cancelOrder, getOrderById } from "../services/orderService";


export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderById(id!);
        setOrder(data);
      } catch (err) {
        Alert.alert("Lỗi", "Không thể tải chi tiết đơn hàng!");
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  const handleCancel = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn hủy đơn hàng này?", [
      { text: "Không", style: "cancel" },
      {
        text: "Đồng ý",
        onPress: async () => {
          try {
            setCanceling(true);
            const data = await cancelOrder(id!);
            setOrder(data.order);
            Alert.alert("Thành công", "Đơn hàng đã được hủy!");
          } catch (err: any) {
            Alert.alert("Lỗi", err.response?.data?.message || "Không thể hủy đơn!");
          } finally {
            setCanceling(false);
          }
        },
      },
    ]);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Đang chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "delivering":
        return "Đang giao hàng";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mã đơn hàng</Text>
          <Text style={styles.sectionText}>{order._id}</Text>
          <Text style={styles.sectionText}>
            Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
          </Text>
          <Text style={styles.sectionText}>
            Trạng thái:{" "}
            <Text style={{ fontWeight: "700", color: "#f97316" }}>
              {getStatusLabel(order.status)}
            </Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm</Text>
          {order.items.map((item: any, i: number) => (
            <View key={i} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.productName}</Text>
                <Text style={styles.itemQty}>Số lượng: {item.quantity}</Text>
                <Text style={styles.itemPrice}>
                  ₫{(item.price * item.quantity).toLocaleString("vi-VN")}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          {order.deliveryAddress && (
            <>
              <Text style={styles.sectionText}>{order.deliveryAddress.fullName}</Text>
              <Text style={styles.sectionText}>{order.deliveryAddress.phone}</Text>
              <Text style={styles.sectionText}>
                {order.deliveryAddress.addressLine}, {order.deliveryAddress.ward},{" "}
                {order.deliveryAddress.district}, {order.deliveryAddress.city}
              </Text>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tổng cộng</Text>
          <Text style={styles.totalAmount}>
            ₫{order.totalAmount.toLocaleString("vi-VN")}
          </Text>
        </View>

        {order.status === "pending" && (
          <TouchableOpacity
            style={[styles.cancelBtn, canceling && { opacity: 0.6 }]}
            onPress={handleCancel}
            disabled={canceling}
          >
            <Text style={styles.cancelText}>
              {canceling ? "Đang hủy..." : "Hủy đơn hàng"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "white",
    padding: 16,
  },
  headerTitle: { fontWeight: "600", fontSize: 18 },
  section: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 14,
  },
  sectionTitle: { fontWeight: "600", color: "#111827", marginBottom: 6 },
  sectionText: { color: "#374151", marginBottom: 4 },
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  itemName: { fontWeight: "500", color: "#111827" },
  itemQty: { color: "#6b7280", fontSize: 13 },
  itemPrice: { color: "#f97316", fontWeight: "600" },
  totalAmount: { color: "#f97316", fontWeight: "700", fontSize: 18 },
  cancelBtn: {
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  cancelText: { color: "white", fontWeight: "600" },
});
