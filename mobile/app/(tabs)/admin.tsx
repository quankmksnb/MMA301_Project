import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Plus,
} from "lucide-react-native";
import { Platform, ActionSheetIOS } from "react-native";
import { Pencil, Trash2, Image as ImageIcon } from "lucide-react-native";
import { Image } from "react-native";

import {
  getCategories,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { getAllOrders, getAllUsers, updateOrderStatus } from "../services/sellerService";
import { router } from "expo-router";

export default function AdminDashboardScreen() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "orders" | "users"
  >("overview");

  const [searchTerm, setSearchTerm] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // 🟢 Load toàn bộ dữ liệu admin
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cateRes, orderRes, userRes, productRes] = await Promise.all([
          getCategories(),
          getAllOrders(),
          getAllUsers(),
          getAllProducts(),
        ]);
        setCategories(cateRes);
        setOrders(orderRes);
        setUsers(userRes);
        setProducts(productRes);
      } catch {
        console.log("🧨 Lỗi load dashboard");
        Alert.alert("Lỗi", "Không thể tải dữ liệu quản trị!");
      }
    };
    loadData();
  }, []);
  const openCategorySelector = () => {
    if (Platform.OS === "ios") {
      // iOS native ActionSheet
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "Chọn danh mục",
          options: [...categories.map((c) => c.name), "Hủy"],
          cancelButtonIndex: categories.length,
        },
        (buttonIndex) => {
          if (buttonIndex < categories.length) {
            const selected = categories[buttonIndex];
            setEditingProduct({ ...editingProduct, category: selected._id });
          }
        }
      );
    } else {
      // Android hoặc Web fallback dùng modal cũ
      setShowCategoryModal(true);
    }
  };

  // 🟢 Thêm sản phẩm
  const handleAddProduct = async () => {
    try {
      const { name, description, price, stock, category, image } =
        editingProduct;
      if (!name || !price || !category)
        return Alert.alert(
          "Thiếu thông tin",
          "Vui lòng nhập đủ tên, giá, danh mục!"
        );

      const res = await addProduct({
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock || "0"),
        category,
        image:
          image ||
          "https://lavenderstudio.com.vn/wp-content/uploads/2017/03/chup-san-pham.jpg",
      });

      setProducts((prev) => [...prev, res.product]);
      setShowProductModal(false);
      setEditingProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: "",
      });
      Alert.alert("✅ Thành công", "Đã thêm sản phẩm mới!");
    } catch (err: any) {
      Alert.alert(
        "Lỗi",
        err.response?.data?.message || "Không thể thêm sản phẩm!"
      );
    }
  };

  // 🟠 Sửa sản phẩm
  const handleEditProduct = async () => {
    try {
      const { _id, name, description, price, stock, category, image } =
        editingProduct;

      const res = await updateProduct(_id, {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock || "0"),
        category,
        image,
      });

      setProducts((prev) => prev.map((p) => (p._id === _id ? res.product : p)));
      setShowProductModal(false);
      Alert.alert("✅ Thành công", "Đã cập nhật sản phẩm!");
    } catch (err: any) {
      Alert.alert(
        "Lỗi",
        err.response?.data?.message || "Không thể cập nhật sản phẩm!"
      );
    }
  };

  // 🔴 Xóa sản phẩm
  const handleDeleteProduct = async (id: string) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa sản phẩm này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p._id !== id));
            Alert.alert("🗑️ Đã xóa sản phẩm!");
          } catch {
            Alert.alert("Lỗi", "Không thể xóa sản phẩm!");
          }
        },
      },
    ]);
  };

  const handleChangeStatus = (orderId: string, currentStatus: string) => {
  const options = ["pending", "confirmed", "delivering", "completed", "cancelled"];

  const currentIndex = options.indexOf(currentStatus);

  if (Platform.OS === "ios") {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: "Chọn trạng thái mới",
        options: [...options.map((s) => s.toUpperCase()), "Hủy"],
        cancelButtonIndex: options.length,
      },
      async (buttonIndex) => {
        if (buttonIndex < options.length) {
          const newStatus = options[buttonIndex];
          if (newStatus === currentStatus) return;

          try {
            const res = await updateOrderStatus(orderId, newStatus);
            setOrders((prev) =>
              prev.map((o) =>
                o._id === orderId ? { ...o, status: newStatus } : o
              )
            );
            Alert.alert("✅ Thành công", `Đã cập nhật trạng thái: ${newStatus}`);
          } catch (err: any) {
            Alert.alert(
              "Lỗi",
              err.response?.data?.message || "Không thể cập nhật trạng thái!"
            );
          }
        }
      }
    );
  } else {
    // Android fallback
    Alert.alert(
      "Chọn trạng thái mới",
      "",
      options.map((s) => ({
        text: s.toUpperCase(),
        onPress: async () => {
          try {
            await updateOrderStatus(orderId, s);
            setOrders((prev) =>
              prev.map((o) =>
                o._id === orderId ? { ...o, status: s } : o
              )
            );
            Alert.alert("✅ Thành công", `Đã cập nhật trạng thái: ${s}`);
          } catch {
            Alert.alert("Lỗi", "Không thể cập nhật trạng thái!");
          }
        },
      }))
    );
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.header}>📊 Bảng điều khiển Admin</Text>

      {/* TAB MENU */}
      <View style={styles.tabBar}>
        {["overview", "products", "orders", "users"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as any)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab === "overview"
                ? "Tổng quan"
                : tab === "products"
                ? "Sản phẩm"
                : tab === "orders"
                ? "Đơn hàng"
                : "Người dùng"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ marginTop: 10 }} keyboardShouldPersistTaps="handled">
        {/* 🔹 OVERVIEW */}
        {activeTab === "overview" && (
          <View>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <DollarSign color="#22c55e" size={20} />
                <Text style={styles.statLabel}>Tổng doanh thu</Text>
                <Text style={styles.statValue}>
                  ₫
                  {orders
                    .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
                    .toLocaleString("vi-VN")}
                </Text>
              </View>
              <View style={styles.statCard}>
                <ShoppingBag color="#3b82f6" size={20} />
                <Text style={styles.statLabel}>Tổng đơn hàng</Text>
                <Text style={styles.statValue}>{orders.length}</Text>
              </View>
              <View style={styles.statCard}>
                <Package color="#f97316" size={20} />
                <Text style={styles.statLabel}>Tổng sản phẩm</Text>
                <Text style={styles.statValue}>{products.length}</Text>
              </View>
              <View style={styles.statCard}>
                <Users color="#a855f7" size={20} />
                <Text style={styles.statLabel}>Người dùng</Text>
                <Text style={styles.statValue}>{users.length}</Text>
              </View>
            </View>
          </View>
        )}

        {/* 🔹 PRODUCTS */}
        {activeTab === "products" && (
          <View>
            <TextInput
              placeholder="Tìm sản phẩm..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.search}
            />
            <TouchableOpacity
              onPress={() => {
                setEditingProduct({
                  name: "",
                  description: "",
                  price: "",
                  stock: "",
                  category: "",
                  image: "",
                });
                setShowProductModal(true);
              }}
              style={styles.addButton}
            >
              <Plus size={20} color="white" />
              <Text style={{ color: "white", marginLeft: 6 }}>
                Thêm sản phẩm
              </Text>
            </TouchableOpacity>

            {products
              .filter((p) =>
                (p.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
              )
              .map((p) => (
                <View key={p._id} style={styles.card}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{p.name}</Text>
                    <Text style={styles.cardCategory}>
                      Danh mục: {p.category?.name || "Không rõ"}
                    </Text>
                    <Text style={styles.cardPrice}>
                      ₫{p.price.toLocaleString("vi-VN")}
                    </Text>
                    <Text style={styles.cardStock}>Kho: {p.stock}</Text>
                  </View>

                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingProduct(p);
                        setShowProductModal(true);
                      }}
                    >
                      <Text style={{ color: "#3b82f6", fontWeight: "600" }}>
                        Sửa
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteProduct(p._id)}
                    >
                      <Text style={{ color: "#ef4444", fontWeight: "600" }}>
                        Xóa
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
        )}

        {/* 🔹 ORDERS */}
        {activeTab === "orders" && (
          <View>
            {orders.map((o) => (
              <TouchableOpacity
                key={o._id}
                style={[styles.card, { flexDirection: "column" }]}
                onPress={() =>
                  router.push(`/(tabs)/order-detail?id=${o._id}`)
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>
                      Mã đơn: {o._id.slice(-6)}
                    </Text>
                    <Text style={styles.cardCategory}>
                      Khách hàng: {o.user?.name || "Ẩn danh"}
                    </Text>
                    <Text style={styles.cardPrice}>
                      ₫{o.totalAmount.toLocaleString("vi-VN")}
                    </Text>
                  </View>

                  {/* Nút thay đổi trạng thái */}
                  <TouchableOpacity
                    style={styles.statusButton}
                    onPress={() => handleChangeStatus(o._id, o.status)}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        o.status === "completed"
                          ? { color: "#22c55e" }
                          : o.status === "processing"
                          ? { color: "#3b82f6" }
                          : o.status === "pending"
                          ? { color: "#f59e0b" }
                          : { color: "#ef4444" },
                      ]}
                    >
                      {o.status?.toUpperCase() || "UNKNOWN"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 🔹 USERS */}
        {activeTab === "users" && (
          <View>
            {users.map((u) => (
              <View key={u._id} style={styles.card}>
                <Text style={styles.cardTitle}>{u.name}</Text>
                <Text style={styles.cardCategory}>{u.email}</Text>
                <Text style={styles.cardStock}>Vai trò: {u.role}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ➕ MODAL THÊM / SỬA SẢN PHẨM */}
      <Modal
        visible={showProductModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={styles.modalWrapper}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowProductModal(false)}
            style={{ flex: 0.1 }}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct._id ? "Sửa sản phẩm" : "Thêm sản phẩm"}
              </Text>
              <TouchableOpacity onPress={() => setShowProductModal(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              style={styles.scrollContent}
            >
              <TextInput
                placeholder="Tên sản phẩm"
                value={editingProduct.name}
                onChangeText={(text) =>
                  setEditingProduct({ ...editingProduct, name: text })
                }
                style={styles.input}
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                placeholder="Mô tả"
                value={editingProduct.description}
                onChangeText={(text) =>
                  setEditingProduct({ ...editingProduct, description: text })
                }
                style={[styles.input, { height: 80 }]}
                multiline
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                placeholder="Giá (₫)"
                keyboardType="decimal-pad"
                value={editingProduct.price?.toString()}
                onChangeText={(text) =>
                  setEditingProduct({ ...editingProduct, price: text })
                }
                style={styles.input}
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                placeholder="Số lượng tồn kho"
                keyboardType="number-pad"
                value={editingProduct.stock?.toString()}
                onChangeText={(text) =>
                  setEditingProduct({ ...editingProduct, stock: text })
                }
                style={styles.input}
                placeholderTextColor="#9ca3af"
              />

              {/* DANH MỤC DROPDOWN */}
              <Text style={styles.label}>Danh mục</Text>
              <TouchableOpacity
                onPress={openCategorySelector}
                style={styles.dropdownBox}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    color: editingProduct.category ? "#111827" : "#9ca3af",
                    fontSize: 16,
                  }}
                >
                  {editingProduct.category
                    ? categories.find((c) => c._id === editingProduct.category)
                        ?.name
                    : "Chọn danh mục sản phẩm"}
                </Text>
              </TouchableOpacity>

              {/* UPLOAD ẢNH */}
              <TouchableOpacity
                style={styles.uploadBox}
                onPress={() =>
                  Alert.alert("📸 Upload", "Tính năng sắp ra mắt!")
                }
                activeOpacity={0.7}
              >
                <Text style={{ color: "#6b7280", fontSize: 16 }}>
                  📷 Tải ảnh sản phẩm
                </Text>
              </TouchableOpacity>

              <View style={{ height: 20 }} />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowProductModal(false)}
                style={styles.cancelBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={
                  editingProduct._id ? handleEditProduct : handleAddProduct
                }
                style={styles.saveBtn}
                activeOpacity={0.7}
              >
                <Text
                  style={{ color: "white", fontWeight: "600", fontSize: 16 }}
                >
                  {editingProduct._id ? "Cập nhật" : "Lưu"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 🔽 MODAL CHỌN DANH MỤC */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.categoryModal}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>Chọn danh mục</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{ maxHeight: 350 }}
              keyboardShouldPersistTaps="handled"
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat._id}
                  onPress={() => {
                    setEditingProduct({
                      ...editingProduct,
                      category: cat._id,
                    });
                    setShowCategoryModal(false);
                  }}
                  style={styles.categoryItem}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      editingProduct.category === cat._id && {
                        color: "#f97316",
                        fontWeight: "700",
                      },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowCategoryModal(false)}
              style={styles.closeCategoryBtn}
              activeOpacity={0.8}
            >
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                Đóng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 16 },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#f97316",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  activeTab: { backgroundColor: "#f97316" },
  tabText: { color: "#333" },
  activeTabText: { color: "#fff" },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginVertical: 6,
  },
  statLabel: { color: "#6b7280", fontSize: 12, marginTop: 4 },
  statValue: { fontWeight: "700", fontSize: 16, color: "#111827" },
  search: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#f97316",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
  },
  cardTitle: { fontWeight: "bold", fontSize: 15 },
  cardCategory: { color: "#888" },
  cardPrice: { color: "#f97316", fontWeight: "bold" },
  cardStock: { color: "#666" },
  modalWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    padding: 16,
    maxHeight: "90%",
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#111827",
    flex: 1,
    textAlign: "center",
  },
  closeBtn: {
    fontSize: 24,
    color: "#6b7280",
    fontWeight: "600",
    paddingHorizontal: 8,
  },
  scrollContent: {
    flexGrow: 1,
  },
  input: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    color: "#111827",
  },
  label: { color: "#374151", fontWeight: "500", marginBottom: 6 },
  dropdownBox: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#f9fafb",
    marginBottom: 10,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  cancelBtn: {
    backgroundColor: "#f3f4f6",
    padding: 14,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cancelBtnText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#f97316",
    padding: 14,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    width: "85%",
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 12,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  categoryItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  categoryText: { fontSize: 16, color: "#374151", fontWeight: "500" },
  closeCategoryBtn: {
    backgroundColor: "#f97316",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 14,
    alignItems: "center",
  },
  statusButton: {
  borderWidth: 1,
  borderColor: "#e5e7eb",
  borderRadius: 8,
  paddingVertical: 6,
  paddingHorizontal: 10,
  alignSelf: "flex-start",
  backgroundColor: "#f9fafb",
},
statusText: {
  fontWeight: "600",
  fontSize: 13,
  textTransform: "uppercase",
},

});
