import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Cart.css";

export default function Cart({ cart, removeFromCart, clearCart }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const total = cart.reduce((sum, item) => sum + item.sector.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🛒</div>
        <h2>{t("emptyCart")}</h2>
        <p>{t("emptyCartMsg")}</p>
        <button onClick={() => navigate("/matches")}>{t("matches")}</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>{t("cart")}</h1>
        <button className="btn-clear" onClick={clearCart}>{t("clear")}</button>
      </div>

      <div className="cart-body">
        <div className="cart-items">
          {cart.map((item, i) => (
            <div key={i} className="cart-item">
              <div className="cart-item-info">
                <div className="cart-match">{item.match.home} vs {item.match.away}</div>
                <div className="cart-meta">📅 {item.match.date} | ⏰ {item.match.time}</div>
                <div className="cart-sector">{item.sector.name} — {item.qty} ta chipta</div>
              </div>
              <div className="cart-item-right">
                <div className="cart-price">{(item.sector.price * item.qty).toLocaleString()} so'm</div>
                <button className="btn-remove" onClick={() => removeFromCart(i)}>✕</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-total">
            <span>{t("total")}:</span>
            <strong>{total.toLocaleString()} so'm</strong>
          </div>
          <button className="btn-checkout" onClick={() => navigate("/checkout")}>
            {t("checkout")}
          </button>
        </div>
      </div>
    </div>
  );
}
