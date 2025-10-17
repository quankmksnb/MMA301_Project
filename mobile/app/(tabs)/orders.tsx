import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { mockOrders, Order } from "../data/mockData";

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState<
    "all" | "in-progress" | "delivered"
  >("all");

  const filteredOrders = mockOrders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "in-progress") return order.status === "In Progress";
    if (activeTab === "delivered") return order.status === "Delivered";
    return true;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "In Progress":
        return { backgroundColor: "#fef9c3", color: "#854d0e" };
      case "Delivered":
        return { backgroundColor: "#dcfce7", color: "#166534" };
      case "Cancelled":
        return { backgroundColor: "#fee2e2", color: "#991b1b" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          {["all", "in-progress", "delivered"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() =>
                setActiveTab(tab as "all" | "in-progress" | "delivered")
              }
              style={[
                styles.tabButton,
                activeTab === tab && styles.tabButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab === "all"
                  ? "All"
                  : tab === "in-progress"
                  ? "In Progress"
                  : "Delivered"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Orders List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptyText}>
              {activeTab === "all"
                ? "You haven't placed any orders yet"
                : `No ${activeTab.replace("-", " ")} orders`}
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <Text
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: getStatusStyle(order.status)
                        .backgroundColor,
                      color: getStatusStyle(order.status).color,
                    },
                  ]}
                >
                  {order.status}
                </Text>
              </View>

              <View style={styles.itemsList}>
                {order.items.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemText}>
                      {item.quantity}x {item.name}
                    </Text>
                    <Text style={styles.itemAmount}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>
                  ${order.total.toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
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
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingVertical: 10,
  },
  tabButtonActive: { backgroundColor: "#f97316" },
  tabText: {
    textAlign: "center",
    color: "#6b7280",
    fontWeight: "500",
  },
  tabTextActive: { color: "white" },

  // Order card
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

  // Empty
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyIcon: { fontSize: 60, marginBottom: 8 },
  emptyTitle: { color: "#111827", fontSize: 18, fontWeight: "600" },
  emptyText: { color: "#6b7280", marginTop: 4 },
});
