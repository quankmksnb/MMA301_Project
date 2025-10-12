import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomNav } from '@/components/BottomNav';
import HomeScreen from './index';
import ExploreScreen from './explore';

export default function CustomTabLayout() {
  const [activeScreen, setActiveScreen] = useState('home');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen />;
      case 'cart':
        return <ExploreScreen />; // tạm dùng Explore làm Cart demo
      case 'orders':
        return <ExploreScreen />;
      case 'profile':
        return <ExploreScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
      <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} cartCount={3} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, paddingBottom: 60 }, // chừa chỗ cho bottom nav
});
