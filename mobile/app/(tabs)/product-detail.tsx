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
import { useLocalSearchParams, router } from "expo-router";
import { products } from "../data/mockData";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((p) => p.id === Number(id));
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#6b7280" }}>Product not found</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    // TODO: Sau này gọi API add-to-cart
    router.push("/(tabs)/cart");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Image */}
      <View style={styles.headerImageBox}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Image source={{ uri: product.image }} style={styles.image} />
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.name}>{product.name}</Text>

        {/* ⭐ Rating */}
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name="star"
              size={18}
              color={
                star <= Math.floor(product.rating)
                  ? "#facc15"
                  : "#d1d5db"
              }
            />
          ))}
          <Text style={styles.ratingText}>({product.rating})</Text>
        </View>

        {/* 📝 Description */}
        <View style={{ marginTop: 12 }}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* 📦 Category */}
        <View style={styles.categoryBox}>
          <Text style={styles.categoryText}>{product.category}</Text>
        </View>

        {/* 🔢 Quantity + Price */}
        <View style={styles.quantityBox}>
          <View style={styles.quantityLeft}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantityButtons}>
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                style={styles.qtyButton}
              >
                <Ionicons name="remove-outline" size={18} color="#111827" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                style={styles.qtyButton}
              >
                <Ionicons name="add-outline" size={18} color="#111827" />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalPrice}>
              ${(product.price * quantity).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* 🛒 Add to Cart Button */}
        <TouchableOpacity
          onPress={handleAddToCart}
          style={styles.addToCartBtn}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  headerImageBox: { position: "relative" },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  image: { width: "100%", height: 280, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },

  content: { padding: 20, backgroundColor: "white", borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -10 },
  name: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 8 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 8 },
  ratingText: { color: "#6b7280", fontSize: 13, marginLeft: 4 },
  sectionTitle: { color: "#111827", fontWeight: "600", marginBottom: 4, fontSize: 16 },
  description: { color: "#6b7280", lineHeight: 20 },

  categoryBox: {
    marginTop: 16,
    backgroundColor: "#ffedd5",
    alignSelf: "flex-start",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  categoryText: { color: "#ea580c", fontSize: 13, fontWeight: "500" },

  quantityBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    padding: 14,
    marginTop: 20,
    alignItems: "center",
  },
  quantityLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  quantityLabel: { color: "#374151", fontSize: 14 },
  quantityButtons: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyButton: {
    backgroundColor: "white",
    borderRadius: 50,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  qtyText: { color: "#111827", minWidth: 20, textAlign: "center" },
  totalLabel: { color: "#6b7280", fontSize: 12 },
  totalPrice: {
    color: "#f97316",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "right",
  },

  addToCartBtn: {
    backgroundColor: "#f97316",
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: "center",
  },
  addToCartText: { color: "white", fontSize: 16, fontWeight: "600" },
});
