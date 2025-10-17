import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { categories, products, Product } from "../data/mockData";
import { router } from "expo-router";

export default function HomeScreen() {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = (product: Product) => {
    setCartCount(cartCount + 1);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>User</Text>
          </View>

          <TouchableOpacity style={styles.cartBtn}>
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
            placeholder="Search for food..."
            style={styles.searchInput}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Dishes */}
        <Text style={styles.sectionTitle}>Featured Dishes</Text>
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => router.push(`/product-detail?id=${product.id}`)} // 👈 điều hướng
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
                  ${product.price.toFixed(2)}
                </Text>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation(); // ✅ tránh bấm Add mà lại mở detail
                    handleAddToCart(product);
                  }}
                  style={styles.addBtn}
                >
                  <Ionicons name="add-circle-outline" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
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
    padding: 6, // nhỏ hơn một chút vì icon không cần nhiều padding
    justifyContent: "center",
    alignItems: "center",
  },
  addText: { color: "white", fontWeight: "600" },
});
