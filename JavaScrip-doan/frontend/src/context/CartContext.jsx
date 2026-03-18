import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ✅ GỘP: addToCart nâng cấp (thay thế bản cũ)
  const addToCart = (food) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.name === food.name
      );

      if (existingItem) {
        // nếu đã có → tăng số lượng
        return prevCart.map((item) =>
          item.name === food.name
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        // nếu mới → thêm vào với quantity = 1
        return [...prevCart, { ...food, quantity: 1 }];
      }
    });
  };

  // ✅ từ file 2 (file 1 không có)
  const removeFromCart = (foodName) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.name !== foodName)
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};