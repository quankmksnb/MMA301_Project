import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useCart } from "../context/CartContext";
import {
  checkoutCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../services/cartService";

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCartCount } = useCart();

  // 🟢 Load giỏ hàng từ backend
  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await getCart();
        setCartItems(data.items || []);
        setCartCount(data.items?.length || 0);
      } catch (error: any) {
        console.log("🧨 Lỗi tải giỏ hàng:", error.message || error);
        Alert.alert("Lỗi", "Không thể tải giỏ hàng! Hãy kiểm tra lại kết nối.");
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const subtotal = cartItems.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );
  const total = subtotal;

  // 🟠 Cập nhật số lượng
  const handleUpdateQuantity = async (productId: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      await updateCartItem(productId, newQty);
      setCartItems((prev) =>
        prev.map((i) =>
          i.product._id === productId ? { ...i, quantity: newQty } : i
        )
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật số lượng!");
    }
  };

  // 🔴 Xóa sản phẩm khỏi giỏ
  const handleRemoveItem = async (productId: string) => {
    try {
      await removeCartItem(productId);
      setCartItems((prev) => prev.filter((i) => i.product._id !== productId));
      setCartCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xóa sản phẩm!");
    }
  };

  // 🟣 Thanh toán
  const handleCheckout = async () => {
    try {
      router.push("/(tabs)/checkout")
      // Alert.alert("Thành công", "Đơn hàng đã được tạo thành công!");
      // setCartItems([]);
      // setCartCount(0);
      // router.push("/orders");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thanh toán!");
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
        <Text style={styles.headerTitle}>Giỏ hàng của bạn</Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Ionicons name="bag-outline" size={64} color="#9ca3af" />
          </View>
          <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
          <Text style={styles.emptySubtitle}>
            Hãy thêm vài món ăn ngon vào giỏ nào 🍔
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={styles.browseButtonText}>Tiếp tục mua hàng</Text>
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
              <View key={item.product._id} style={styles.cartCard}>
                <Image
                  source={{ uri: item.product.image }}
                  style={styles.cartImage}
                  resizeMode="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.product.name}</Text>
                  <Text style={styles.itemPrice}>
                    ₫{item.product.price.toLocaleString("vi-VN")}
                  </Text>
                  <View style={styles.itemBottom}>
                    <View style={styles.quantityBox}>
                      <TouchableOpacity
                        style={styles.qtyButton}
                        onPress={() =>
                          handleUpdateQuantity(
                            item.product._id,
                            item.quantity - 1
                          )
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
                          handleUpdateQuantity(
                            item.product._id,
                            item.quantity + 1
                          )
                        }
                      >
                        <Ionicons
                          name="add-outline"
                          size={18}
                          color="#374151"
                        />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleRemoveItem(item.product._id)}
                      style={styles.removeBtn}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#ef4444"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <View style={{ height: 160 }} />
          </ScrollView>

          {/* Tổng kết */}
          <View style={styles.summaryBox}>
            <View style={styles.rowBetween}>
              <Text style={styles.textGray}>Tạm tính</Text>
              <Text style={styles.textGray}>
                ₫{subtotal.toLocaleString("vi-VN")}
              </Text>
            </View>
            <View style={styles.rowBetween}>
              
            </View>
            <View style={styles.rowBetweenTotal}>
              <Text style={styles.textDark}>Tổng cộng</Text>
              <Text style={styles.totalText}>
                ₫{total.toLocaleString("vi-VN")}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
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
