import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartItem, products } from "../data/mockData";

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { ...products[0], quantity: 1 },
    { ...products[2], quantity: 2 },
    
  ]);

  const deliveryFee = 2.99;
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + deliveryFee;

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
      </View>

      {cartItems.length === 0 ? (
        // 🛒 Trường hợp giỏ hàng trống
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Ionicons name="bag-outline" size={64} color="#9ca3af" />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some delicious food to get started!
          </Text>
          <TouchableOpacity style={styles.browseButton}>
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Danh sách sản phẩm */}
          <ScrollView
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.cartImage}
                  resizeMode="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  <View style={styles.itemBottom}>
                    <View style={styles.quantityBox}>
                      <TouchableOpacity
                        style={styles.qtyButton}
                        onPress={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Ionicons
                          name="remove-outline"
                          size={18}
                          color="#374151"
                        />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyButton}
                        onPress={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Ionicons name="add-outline" size={18} color="#374151" />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleRemoveItem(item.id)}
                      style={styles.removeBtn}
                    >
                      <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {/* 👇 Spacer để tránh bị summary che */}
            <View style={{ height: 160 }} />
          </ScrollView>

          {/* Tổng kết */}
          <View style={styles.summaryBox}>
            <View style={styles.rowBetween}>
              <Text style={styles.textGray}>Subtotal</Text>
              <Text style={styles.textGray}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.textGray}>Delivery Fee</Text>
              <Text style={styles.textGray}>${deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.rowBetweenTotal}>
              <Text style={styles.textDark}>Total</Text>
              <Text style={styles.totalText}>${total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutBtn}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
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

  // Empty cart
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyIconBox: {
    backgroundColor: "#f3f4f6",
    borderRadius: 100,
    padding: 24,
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 20, fontWeight: "600", color: "#111827" },
  emptySubtitle: {
    color: "#6b7280",
    textAlign: "center",
    marginVertical: 8,
  },
  browseButton: {
    backgroundColor: "#f97316",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 8,
  },
  browseButtonText: { color: "white", fontWeight: "600", fontSize: 16 },

  // Cart list
  cartList: { padding: 16 },
  cartCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  cartImage: { width: 80, height: 80, borderRadius: 12, marginRight: 12 },
  itemName: { color: "#111827", fontWeight: "600", fontSize: 16 },
  itemPrice: { color: "#f97316", fontSize: 14, marginBottom: 8 },
  itemBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 4,
  },
  qtyButton: {
    backgroundColor: "white",
    borderRadius: 6,
    padding: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  qtyText: { minWidth: 24, textAlign: "center", color: "#111827" },
  removeBtn: { padding: 6 },

  // Summary
  summaryBox: {
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
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  rowBetweenTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
  },
  textGray: { color: "#6b7280", fontSize: 14 },
  textDark: { color: "#111827", fontWeight: "600", fontSize: 15 },
  totalText: { color: "#f97316", fontWeight: "700", fontSize: 16 },
  checkoutBtn: {
    backgroundColor: "#f97316",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
    alignItems: "center",
  },
  checkoutText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
