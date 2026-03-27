import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ cartCount }) {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src="/neftchi-logo.png" alt="Neftchi PFK" onError={(e) => (e.target.style.display = "none")} />
        <span>Neftchi PFK</span>
      </Link>
      <div className="navbar-links">
        <Link to="/">Bosh sahifa</Link>
        <Link to="/matches">O'yinlar</Link>
        <Link to="/cart" className="cart-link">
          🛒 Savat {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
}
