import React, { createContext, useState, useContext, ReactNode } from "react";

interface CartContextType {
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>; // ✅ Sửa dòng này
  increaseCartCount: () => void;
  decreaseCartCount: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const increaseCartCount = () => setCartCount((prev) => prev + 1);
  const decreaseCartCount = () =>
    setCartCount((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <CartContext.Provider
      value={{ cartCount, setCartCount, increaseCartCount, decreaseCartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
