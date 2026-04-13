import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import "./Navbar.css";

const LANGS = ["uz", "ru", "en"];

export default function Navbar({ cartCount, darkMode, toggleDark }) {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const close = () => setOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" onClick={close}>
        <span>⚽</span>
        <span>Neftchi PFK</span>
      </Link>

      <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
        <span />
        <span />
        <span />
      </button>

      <div className={`navbar-links ${open ? "open" : ""}`}>
        <Link to="/" onClick={close}>{t("home")}</Link>
        <Link to="/matches" onClick={close}>{t("matches")}</Link>

        {user?.email === "admin@neftchi.uz" && (
          <Link to="/admin" className="admin-link" onClick={close}>Admin</Link>
        )}

        {user ? (
          <Link to="/profile" className="profile-link" onClick={close}>
            👤 {user.name.split(" ")[0]}
          </Link>
        ) : (
          <Link to="/login" className="login-link" onClick={close}>{t("login")}</Link>
        )}

        <Link to="/cart" className="cart-link" onClick={close}>
          🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        <div className="lang-switcher">
          {LANGS.map((l) => (
            <button key={l} className={i18n.language === l ? "active" : ""}
              onClick={() => { changeLang(l); close(); }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <button className="dark-toggle" onClick={() => { toggleDark(); close(); }}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}
