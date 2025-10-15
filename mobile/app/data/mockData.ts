export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'In Progress' | 'Delivered' | 'Cancelled';
  items: CartItem[];
}

export const categories = [
  { id: 1, name: 'Pizza', icon: '🍕' },
  { id: 2, name: 'Sushi', icon: '🍣' },
  { id: 3, name: 'Burger', icon: '🍔' },
  { id: 4, name: 'Dessert', icon: '🍰' },
  { id: 5, name: 'Drinks', icon: '🥤' },
  { id: 6, name: 'Pasta', icon: '🍝' },
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1703073186021-021fb5a0bde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGZvb2R8ZW58MXx8fHwxNzYwMjg2ODU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Pizza',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Sushi Platter',
    description: 'Fresh assorted sushi with wasabi and soy sauce',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1700324822763-956100f79b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGphcGFuZXNlJTIwZm9vZHxlbnwxfHx8fDE3NjAyNDU0MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Sushi',
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and special sauce',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmYXN0JTIwZm9vZHxlbnwxfHx8fDE3NjAyMzAzMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Burger',
    rating: 4.6,
  },
  {
    id: 4,
    name: 'Chocolate Cake',
    description: 'Rich chocolate layered cake with cream frosting',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1705933774160-24298027a349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NjAyODY4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Dessert',
    rating: 4.7,
  },
  {
    id: 5,
    name: 'Fresh Smoothie',
    description: 'Tropical fruit smoothie with mango and passion fruit',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1652922664558-03d0f2932e58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmlua3MlMjBiZXZlcmFnZXxlbnwxfHx8fDE3NjAyODc0NTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Drinks',
    rating: 4.4,
  },
  {
    id: 6,
    name: 'Creamy Pasta',
    description: 'Fettuccine with creamy alfredo sauce and parmesan',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1749169337822-d875fd6f4c9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGl0YWxpYW4lMjBmb29kfGVufDF8fHx8MTc2MDI2NjkxMnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Pasta',
    rating: 4.5,
  },
  {
    id: 7,
    name: 'Garden Salad',
    description: 'Fresh mixed greens with vinaigrette dressing',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1651352650142-385087834d9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGhlYWx0aHklMjBmb29kfGVufDF8fHx8MTc2MDI4MjgzN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Salad',
    rating: 4.3,
  },
  {
    id: 8,
    name: 'Ice Cream Sundae',
    description: 'Vanilla ice cream with chocolate sauce and toppings',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1663904458920-f153c162fa79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2UlMjBjcmVhbSUyMGRlc3NlcnR8ZW58MXx8fHwxNzYwMjU5MjA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Dessert',
    rating: 4.6,
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2025-10-10',
    total: 32.98,
    status: 'Delivered',
    items: [
      { ...products[0], quantity: 1 },
      { ...products[2], quantity: 2 },
    ],
  },
  {
    id: 'ORD-002',
    date: '2025-10-11',
    total: 49.97,
    status: 'In Progress',
    items: [
      { ...products[1], quantity: 1 },
      { ...products[4], quantity: 2 },
      { ...products[3], quantity: 1 },
    ],
  },
  {
    id: 'ORD-003',
    date: '2025-10-12',
    total: 24.99,
    status: 'In Progress',
    items: [
      { ...products[1], quantity: 1 },
    ],
  },
];
