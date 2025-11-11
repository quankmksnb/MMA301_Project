import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
} from "lucide-react-native";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
}

interface Order {
  id: string;
  customer: string;
  total: number;
  status: string;
  date: string;
  items: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  joinDate: string;
}

export default function AdminDashboardScreen() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "orders" | "users"
  >("overview");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Margherita Pizza",
      category: "Pizza",
      price: 12.99,
      stock: 50,
      image: "pizza.jpg",
      description: "Classic pizza with tomato and mozzarella",
    },
    {
      id: "2",
      name: "Chicken Burger",
      category: "Burgers",
      price: 8.99,
      stock: 30,
      image: "burger.jpg",
      description: "Juicy chicken burger with lettuce",
    },
    {
      id: "3",
      name: "Caesar Salad",
      category: "Salads",
      price: 7.99,
      stock: 25,
      image: "salad.jpg",
      description: "Fresh caesar salad with croutons",
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customer: "John Doe",
      total: 45.99,
      status: "Completed",
      date: "2025-11-10",
      items: 3,
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      total: 32.5,
      status: "Processing",
      date: "2025-11-11",
      items: 2,
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      total: 28.99,
      status: "Pending",
      date: "2025-11-11",
      items: 2,
    },
  ]);

  const [users, setUsers] = useState<UserData[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      orders: 15,
      totalSpent: 450.0,
      joinDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      orders: 8,
      totalSpent: 280.0,
      joinDate: "2024-03-20",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      orders: 12,
      totalSpent: 380.0,
      joinDate: "2024-02-10",
    },
  ]);

  // === CRUD LOGIC ===
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
    setShowProductModal(false);
  };

  const handleEditProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setEditingProduct(null);
    setShowProductModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDeleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const handleUpdateOrderStatus = (id: string, status: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // === FILTERS ===
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredOrders = orders.filter(
    (o) =>
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // === RENDER ===
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>

      {/* TABS */}
      <View style={styles.tabBar}>
        {(["overview", "products", "orders", "users"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ marginTop: 10 }}>
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <View>
            {/* Stats */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <DollarSign color="#22c55e" size={20} />
                <Text style={styles.statLabel}>Total Revenue</Text>
                <Text style={styles.statValue}>$12,450</Text>
              </View>
              <View style={styles.statCard}>
                <ShoppingBag color="#3b82f6" size={20} />
                <Text style={styles.statLabel}>Total Orders</Text>
                <Text style={styles.statValue}>{orders.length}</Text>
              </View>
              <View style={styles.statCard}>
                <Package color="#f97316" size={20} />
                <Text style={styles.statLabel}>Products</Text>
                <Text style={styles.statValue}>{products.length}</Text>
              </View>
              <View style={styles.statCard}>
                <Users color="#a855f7" size={20} />
                <Text style={styles.statLabel}>Users</Text>
                <Text style={styles.statValue}>{users.length}</Text>
              </View>
            </View>

            {/* Recent Orders */}
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            {orders.slice(0, 3).map((o) => (
              <View key={o.id} style={styles.card}>
                <View>
                  <Text style={styles.cardTitle}>{o.id}</Text>
                  <Text style={styles.cardCategory}>{o.customer}</Text>
                </View>
                <Text
                  style={[
                    styles.status,
                    o.status === "Completed"
                      ? { color: "green" }
                      : o.status === "Processing"
                      ? { color: "blue" }
                      : { color: "orange" },
                  ]}
                >
                  {o.status}
                </Text>
              </View>
            ))}

            {/* Top Products */}
            <Text style={styles.sectionTitle}>Top Products</Text>
            {products.slice(0, 3).map((p) => (
              <View key={p.id} style={styles.card}>
                <View>
                  <Text style={styles.cardTitle}>{p.name}</Text>
                  <Text style={styles.cardCategory}>{p.category}</Text>
                </View>
                <Text style={styles.cardPrice}>${p.price}</Text>
              </View>
            ))}
          </View>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <View>
            <TextInput
              placeholder="Search products..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.search}
            />
            <TouchableOpacity
              onPress={() => {
                setEditingProduct(null);
                setShowProductModal(true);
              }}
              style={styles.addButton}
            >
              <Plus size={20} color="white" />
              <Text style={{ color: "white", marginLeft: 6 }}>Add Product</Text>
            </TouchableOpacity>

            {filteredProducts.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardCategory}>{item.category}</Text>
                  <Text style={styles.cardPrice}>${item.price}</Text>
                  <Text style={styles.cardStock}>Stock: {item.stock}</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingProduct(item);
                      setShowProductModal(true);
                    }}
                  >
                    <Pencil size={22} color="#007bff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteProduct(item.id)}
                  >
                    <Trash2 size={22} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <View>
            <TextInput
              placeholder="Search orders..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.search}
            />
            {filteredOrders.map((order) => (
              <View key={order.id} style={styles.card}>
                <View>
                  <Text style={styles.cardTitle}>{order.id}</Text>
                  <Text style={styles.cardCategory}>{order.customer}</Text>
                  <Text style={styles.cardPrice}>${order.total}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={[
                      styles.status,
                      order.status === "Completed"
                        ? { color: "green" }
                        : order.status === "Processing"
                        ? { color: "blue" }
                        : { color: "orange" },
                    ]}
                  >
                    {order.status}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteOrder(order.id)}
                    style={{ marginTop: 8 }}
                  >
                    <Trash2 size={20} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <View>
            <TextInput
              placeholder="Search users..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.search}
            />
            {filteredUsers.map((u) => (
              <View key={u.id} style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{u.name}</Text>
                  <Text style={styles.cardCategory}>{u.email}</Text>
                  <Text style={styles.cardStock}>
                    {u.orders} orders • ${u.totalSpent.toFixed(2)}
                  </Text>
                  <Text style={styles.cardCategory}>Joined: {u.joinDate}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteUser(u.id)}>
                  <Trash2 size={22} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ADD / EDIT PRODUCT MODAL */}
      <Modal visible={showProductModal} transparent animationType="slide">
        <View style={styles.modalWrapper}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingProduct ? "Edit Product" : "Add Product"}
            </Text>

            <ScrollView>
              <TextInput
                placeholder="Name"
                defaultValue={editingProduct?.name}
                style={styles.input}
                onChangeText={(text) =>
                  setEditingProduct((prev) => ({ ...prev, name: text } as Product))
                }
              />
              <TextInput
                placeholder="Category"
                defaultValue={editingProduct?.category}
                style={styles.input}
                onChangeText={(text) =>
                  setEditingProduct((prev) => ({ ...prev, category: text } as Product))
                }
              />
              <TextInput
                placeholder="Price"
                keyboardType="numeric"
                defaultValue={editingProduct?.price?.toString()}
                style={styles.input}
                onChangeText={(text) =>
                  setEditingProduct((prev) => ({ ...prev, price: parseFloat(text) } as Product))
                }
              />
              <TextInput
                placeholder="Stock"
                keyboardType="numeric"
                defaultValue={editingProduct?.stock?.toString()}
                style={styles.input}
                onChangeText={(text) =>
                  setEditingProduct((prev) => ({ ...prev, stock: parseInt(text) } as Product))
                }
              />
              <TextInput
                placeholder="Description"
                multiline
                numberOfLines={3}
                defaultValue={editingProduct?.description}
                style={[styles.input, { height: 80 }]}
                onChangeText={(text) =>
                  setEditingProduct((prev) => ({ ...prev, description: text } as Product))
                }
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowProductModal(false)}
                style={styles.cancelBtn}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (editingProduct?.id) {
                    handleEditProduct(editingProduct);
                  } else {
                    handleAddProduct({
                      ...(editingProduct as Product),
                      id: Date.now().toString(),
                      name: editingProduct?.name || "New Product",
                      category: editingProduct?.category || "Others",
                      price: editingProduct?.price || 0,
                      stock: editingProduct?.stock || 0,
                      image: "default.jpg",
                      description: editingProduct?.description || "",
                    });
                  }
                }}
                style={styles.saveBtn}
              >
                <Text style={{ color: "white" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 16 },
  header: { fontSize: 20, fontWeight: "bold", textAlign: "center", color: "#ff6600" },
  tabBar: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10, backgroundColor: "#fff" },
  activeTab: { backgroundColor: "#ff6600" },
  tabText: { color: "#333" },
  activeTabText: { color: "#fff" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
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
  sectionTitle: { fontWeight: "700", fontSize: 16, marginTop: 16, marginBottom: 8, color: "#111827" },
  search: { backgroundColor: "#fff", borderRadius: 10, padding: 10, marginVertical: 10 },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#ff6600",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  cardTitle: { fontWeight: "bold", fontSize: 15 },
  cardCategory: { color: "#888" },
  cardPrice: { color: "#ff6600", fontWeight: "bold" },
  cardStock: { color: "#666" },
  status: { fontWeight: "600", textTransform: "capitalize" },
  modalWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "90%",
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 10, textAlign: "center" },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  cancelBtn: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  saveBtn: {
    backgroundColor: "#ff6600",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginLeft: 5,
  },
});
