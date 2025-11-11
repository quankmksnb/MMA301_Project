import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { getUserOrders } from "../services/orderService";
import { router } from "expo-router";

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "confirmed" | "delivering" | "completed" | "cancelled"
  >("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🟢 Load danh sách đơn hàng từ backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (err: any) {
        console.log("🧨 Lỗi tải orders:", err.message);
        Alert.alert("Lỗi", "Không thể tải danh sách đơn hàng!");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // 🟡 Lọc theo tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return { bg: "#fef9c3", color: "#854d0e", label: "Đang chờ xác nhận" };
      case "confirmed":
        return { bg: "#dbeafe", color: "#1e40af", label: "Đã xác nhận" };
      case "delivering":
        return { bg: "#fff7ed", color: "#9a3412", label: "Đang giao hàng" };
      case "completed":
        return { bg: "#dcfce7", color: "#166534", label: "Hoàn thành" };
      case "cancelled":
        return { bg: "#fee2e2", color: "#991b1b", label: "Đã hủy" };
      default:
        return { bg: "#f3f4f6", color: "#374151", label: "Không xác định" };
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {[
            { key: "all", label: "Tất cả" },
            { key: "pending", label: "Chờ xác nhận" },
            { key: "confirmed", label: "Đã xác nhận" },
            { key: "delivering", label: "Đang giao" },
            { key: "completed", label: "Hoàn thành" },
            { key: "cancelled", label: "Đã hủy" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key as any)}
              style={[
                styles.tabButton,
                activeTab === tab.key && styles.tabButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Danh sách đơn */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>Không có đơn hàng</Text>
            <Text style={styles.emptyText}>
              {activeTab === "all"
                ? "Bạn chưa đặt đơn hàng nào."
                : `Không có đơn ở trạng thái "${getStatusStyle(activeTab).label}"`}
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const status = getStatusStyle(order.status);
            return (
              <TouchableOpacity
                key={order._id}
                style={styles.orderCard}
                onPress={() =>
                  router.push(`/(tabs)/order-detail?id=${order._id}`)
                }
              >
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderId}>
                      Mã đơn: {order._id.slice(-6).toUpperCase()}
                    </Text>
                    <Text style={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.statusBadge,
                      { backgroundColor: status.bg, color: status.color },
                    ]}
                  >
                    {status.label}
                  </Text>
                </View>

                <View style={styles.itemsList}>
                  {order.items.slice(0, 2).map((item: any, idx: number) => (
                    <View key={idx} style={styles.itemRow}>
                      <Text style={styles.itemText}>
                        {item.quantity}x {item.productName}
                      </Text>
                      <Text style={styles.itemAmount}>
                        ₫
                        {(item.price * item.quantity).toLocaleString("vi-VN")}
                      </Text>
                    </View>
                  ))}
                  {order.items.length > 2 && (
                    <Text style={styles.moreText}>
                      +{order.items.length - 2} sản phẩm khác
                    </Text>
                  )}
                </View>

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Tổng tiền</Text>
                  <Text style={styles.totalValue}>
                    ₫{order.totalAmount.toLocaleString("vi-VN")}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
  },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#111827" },
  tabs: { flexDirection: "row", gap: 8, marginTop: 12 },
  tabButton: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  tabButtonActive: { backgroundColor: "#f97316" },
  tabText: { color: "#6b7280", fontWeight: "500" },
  tabTextActive: { color: "white" },

  orderCard: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderId: { color: "#111827", fontWeight: "600" },
  orderDate: { color: "#6b7280", fontSize: 13 },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 12,
    overflow: "hidden",
  },
  itemsList: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
    marginTop: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemText: { color: "#4b5563", fontSize: 13 },
  itemAmount: { color: "#374151", fontSize: 13 },
  moreText: { color: "#9ca3af", fontSize: 12, marginTop: 4 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginTop: 8,
    paddingTop: 8,
  },
  totalLabel: { color: "#374151", fontWeight: "500" },
  totalValue: { color: "#f97316", fontWeight: "700" },

  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyIcon: { fontSize: 60, marginBottom: 8 },
  emptyTitle: { color: "#111827", fontSize: 18, fontWeight: "600" },
  emptyText: { color: "#6b7280", marginTop: 4 },
});
