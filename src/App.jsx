import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./i18n/index.js";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import MatchDetail from "./pages/MatchDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Orders from "./pages/Orders";
import "./App.css";

export default function App() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("neftchi-cart") || "[]"); }
    catch { return []; }
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    if (saved) document.body.style.background = "#121212";
    return saved;
  });

  const toggleDark = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("darkMode", next);
      document.body.style.background = next ? "#121212" : "#f5f7fa";
      return next;
    });
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const newCart = [...prev, item];
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
    <AuthProvider>
      <BrowserRouter>
        <div className={darkMode ? "dark-app" : ""}>
          <Navbar cartCount={cartCount} darkMode={darkMode} toggleDark={toggleDark} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/match/:id" element={<MatchDetail addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
