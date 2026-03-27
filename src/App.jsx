import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import MatchDetail from "./pages/MatchDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import "./App.css";

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("neftchi-cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("neftchi-cart", JSON.stringify(newCart));
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.findIndex(
        (c) => c.match.id === item.match.id && c.sector.id === item.sector.id
      );
      let newCart;
      if (existing >= 0) {
        newCart = [...prev];
        newCart[existing] = { ...newCart[existing], qty: newCart[existing].qty + item.qty };
      } else {
        newCart = [...prev, item];
      }
      localStorage.setItem("neftchi-cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => {
      const newCart = prev.filter((_, i) => i !== index);
      localStorage.setItem("neftchi-cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    localStorage.removeItem("neftchi-cart");
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/match/:id" element={<MatchDetail addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
      </Routes>
    </BrowserRouter>
  );
}
