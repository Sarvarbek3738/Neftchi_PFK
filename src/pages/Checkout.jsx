import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

export default function Checkout({ cart, clearCart }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [success, setSuccess] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.sector.price * item.qty, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    clearCart();
    setTimeout(() => navigate("/"), 3000);
  };

  if (success) {
    return (
      <div className="checkout-success">
        <div className="success-icon">✅</div>
        <h2>To'lov muvaffaqiyatli!</h2>
        <p>Chiptalar {form.email} manziliga yuborildi</p>
        <p className="redirect-msg">3 soniyada bosh sahifaga o'tasiz...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="checkout-page">
      <h1>To'lov</h1>
      <div className="checkout-body">
        <div className="checkout-form-wrap">
          <h2>Ma'lumotlaringiz</h2>
          <form onSubmit={handleSubmit} className="checkout-form">
            <label>
              Ism Familiya
              <input
                type="text"
                required
                placeholder="[ism familiya]"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label>
              Telefon raqam
              <input
                type="tel"
                required
                placeholder="+998 90 000 00 00"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                required
                placeholder="[email]"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>

            <h2 style={{ marginTop: "1.5rem" }}>To'lov usuli</h2>
            <div className="payment-methods">
              <label className="payment-option">
                <input type="radio" name="payment" defaultChecked /> Click
              </label>
              <label className="payment-option">
                <input type="radio" name="payment" /> Payme
              </label>
              <label className="payment-option">
                <input type="radio" name="payment" /> Uzcard
              </label>
            </div>

            <button type="submit" className="btn-pay">
              {total.toLocaleString()} so'm to'lash
            </button>
          </form>
        </div>

        <div className="checkout-summary">
          <h2>Buyurtma</h2>
          {cart.map((item, i) => (
            <div key={i} className="summary-item">
              <div>{item.match.home} vs {item.match.away}</div>
              <div className="summary-item-detail">
                {item.sector.name} × {item.qty}
              </div>
              <div className="summary-item-price">
                {(item.sector.price * item.qty).toLocaleString()} so'm
              </div>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-total-row">
            <span>Jami:</span>
            <strong>{total.toLocaleString()} so'm</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
