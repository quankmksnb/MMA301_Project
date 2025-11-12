import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { addToCart, getCategories, getProducts } from "../services/productService";
import { useCart } from "../context/CartContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [userName, setUserName] = useState("User");
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const { increaseCartCount } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");

  // 🟢 Lấy user info
  useEffect(() => {
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.name || "Người dùng");
      }
    };
    loadUser();
  }, []);

  // 🟠 Lấy dữ liệu category + product
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        setCategories(catRes.categories || catRes);
        setProducts(prodRes.products || prodRes);
      } catch (error) {
        console.error("Lỗi load dữ liệu:", error);
        Alert.alert("Lỗi", "Không thể tải dữ liệu. Vui lòng thử lại!");
      }
    };
    loadData();
  }, []);

  

  // 🟣 Thêm vào giỏ hàng
  const handleAddToCart = async (product: any) => {
    try {
      await addToCart(product._id || product.id, 1);
      increaseCartCount(); // 🟢 Cập nhật Context
      Alert.alert("Đã thêm vào giỏ", `${product.name} đã được thêm!`);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thêm sản phẩm vào giỏ hàng!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Xin chào,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>

          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => router.push("/cart")}
          >
            <Ionicons name="cart-outline" size={24} color="#f97316" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            placeholder="Tìm món ăn..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Danh mục</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((cat) => (
            <TouchableOpacity key={cat._id} style={styles.categoryCard}>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Dishes */}
        <Text style={styles.sectionTitle}>Món nổi bật</Text>
        {products
          .filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((product) => (
            <TouchableOpacity
              key={product._id}
              style={styles.productCard}
              onPress={() =>
                router.push(`/product-detail?id=${product._id}`)
              }
            >
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDesc}>{product.description}</Text>
                <View style={styles.productBottom}>
                  <Text style={styles.productPrice}>
                    ₫{product.price.toLocaleString("vi-VN")}
                  </Text>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    style={styles.addBtn}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
  },
  greeting: { color: "#6b7280", fontSize: 14 },
  userName: { color: "#111827", fontSize: 18, fontWeight: "600" },
  cartBtn: {
    backgroundColor: "#fff7ed",
    padding: 10,
    borderRadius: 50,
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: 4,
    top: 4,
    backgroundColor: "#ef4444",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "white", fontSize: 10 },
  searchBar: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: { flex: 1, height: 40, fontSize: 14, color: "#111827" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginTop: 12,
    marginHorizontal: 20,
  },
  categoryList: { paddingHorizontal: 20, gap: 12, marginTop: 8 },
  categoryCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
  },
  categoryIcon: { fontSize: 26 },
  categoryName: { color: "#374151", fontSize: 13 },
  productCard: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    padding: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  productImage: { width: 100, height: 100, borderRadius: 12 },
  productName: { fontWeight: "600", fontSize: 16, color: "#111827" },
  productDesc: { fontSize: 12, color: "#6b7280", marginVertical: 4 },
  productBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: { color: "#f97316", fontWeight: "600", fontSize: 15 },
  addBtn: {
    backgroundColor: "#f97316",
    borderRadius: 8,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
