import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const isSameOptions = (a = [], b = []) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  const addToCart = (food) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item.id === food.id &&
          isSameOptions(item.options, food.options) &&
          (item.instructions || "") === (food.instructions || "")
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === food.id &&
          isSameOptions(item.options, food.options) &&
          (item.instructions || "") === (food.instructions || "")
            ? {
                ...item,
                quantity: (item.quantity || 1) + (food.quantity || 1),
              }
            : item
        );
      }

      return [...prevCart, { ...food, quantity: food.quantity || 1 }];
    });
  };

  const removeFromCart = (foodId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== foodId));
  };

  const updateQuantity = (foodId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === foodId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};