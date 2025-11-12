import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Home, ShoppingCart, Package, User } from 'lucide-react-native';

interface BottomNavProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  cartCount?: number;
}

export function BottomNav({ activeScreen, onNavigate, cartCount = 0 }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'cart', icon: ShoppingCart, label: 'Cart', badge: cartCount },
    { id: 'orders', icon: Package, label: 'Orders' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeScreen === item.id;

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => onNavigate(item.id)}
            style={styles.button}
          >
            <View style={styles.iconWrapper}>
              <Icon
                size={24}
                color={isActive ? '#f97316' : '#9ca3af'} // cam hoặc xám
                strokeWidth={isActive ? 2.5 : 2}
              />
              {item.badge && item.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, { color: isActive ? '#f97316' : '#9ca3af' }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    elevation: 10, // shadow Android
    shadowColor: '#000', // shadow iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
