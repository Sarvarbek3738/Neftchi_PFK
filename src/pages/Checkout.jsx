import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import "./Checkout.css";

const PAYMENT_METHODS = [
  { id: "card", label: "Karta", icon: "💳" },
  { id: "click", label: "Click", icon: "🟡" },
  { id: "payme", label: "Payme", icon: "🔵" },
  { id: "humo", label: "Humo", icon: "🟠" },
];

const PROMO_CODES = { "NEFTCHI10": 10, "VIP20": 20, "SUPER15": 15 };

const PAYMENT_STEPS = [
  "Bank bilan bog'lanilmoqda...",
  "Ma'lumotlar tekshirilmoqda...",
  "To'lov amalga oshirilmoqda...",
  "Chiptalar tayyorlanmoqda...",
];

function formatCardNumber(val) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(val) {
  const d = val.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}
function validateCard(number, expiry, cvv, holder) {
  const num = number.replace(/\s/g, "");
  if (num.length !== 16) return "Karta raqami 16 ta raqam bo'lishi kerak";
  const [mm, yy] = expiry.split("/");
  if (!mm || !yy || parseInt(mm) > 12 || parseInt(mm) < 1) return "Muddati noto'g'ri";
  const now = new Date();
  const exp = new Date(2000 + parseInt(yy), parseInt(mm) - 1);
  if (exp < now) return "Karta muddati o'tgan";
  if (cvv.length !== 3) return "CVV 3 ta raqam bo'lishi kerak";
  if (!holder.trim()) return "Karta egasining ismini kiriting";
  return null;
}

export default function Checkout({ cart, clearCart }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [payment, setPayment] = useState("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", holder: "" });
  const [cardError, setCardError] = useState("");
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");

  // OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const otpRefs = useRef([]);

  // Payment steps
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.sector.price * item.qty, 0);
  const total = Math.round(subtotal * (1 - discount / 100));

  // OTP timer
  useEffect(() => {
    if (!otpSent || otpTimer <= 0) return;
    const t = setInterval(() => setOtpTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [otpSent, otpTimer]);

  const sendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpTimer(60);
    setOtpError("");
    // Demo: consoleda ko'rsatamiz
    console.log("OTP kod:", code);
    alert(`Demo OTP kod: ${code}\n(Haqiqiy tizimda SMS ga keladi)`);
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    const entered = otp.join("");
    if (entered === generatedOtp) {
      processPayment();
    } else {
      setOtpError("Kod noto'g'ri. Qayta urinib ko'ring");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (payment === "card") {
      const err = validateCard(card.number, card.expiry, card.cvv, card.holder);
      if (err) { setCardError(err); return; }
      setCardError("");
    }
    sendOtp();
  };

  const processPayment = () => {
    setLoading(true);
    setStep(0);
    let s = 0;
    const interval = setInterval(() => {
      s++;
      setStep(s);
      if (s >= PAYMENT_STEPS.length) {
        clearInterval(interval);
        const id = "NFT-" + Date.now().toString().slice(-6);
        const orders = JSON.parse(localStorage.getItem("neftchi-orders") || "[]");
        orders.unshift({ id, date: new Date().toLocaleString("uz-UZ"), items: cart, total, email: form.email });
        localStorage.setItem("neftchi-orders", JSON.stringify(orders));
        setOrderId(id);
        setLoading(false);
        setSuccess(true);
        clearCart();
      }
    }, 900);
  };

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setDiscount(PROMO_CODES[code]);
      setPromoMsg(`✅ ${PROMO_CODES[code]}% chegirma qo'llandi!`);
    } else {
      setPromoMsg("❌ Noto'g'ri promo kod");
      setDiscount(0);
    }
  };

  if (loading) {
    return (
      <div className="payment-loading">
        <div className="payment-spinner" />
        <h2>{PAYMENT_STEPS[Math.min(step, PAYMENT_STEPS.length - 1)]}</h2>
        <div className="payment-progress">
          <div className="payment-progress-bar" style={{ width: `${(step / PAYMENT_STEPS.length) * 100}%` }} />
        </div>
        <p>Iltimos kuting...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="checkout-success">
        <div className="success-icon">✅</div>
        <h2>To'lov muvaffaqiyatli!</h2>
        <p>Buyurtma raqami: <strong>{orderId}</strong></p>
        <p>Chiptalar <strong>{form.email}</strong> manziliga yuborildi</p>
        <div className="qr-wrap">
          <p>Chiptangizning QR kodi:</p>
          <QRCodeSVG value={`NEFTCHI-TICKET:${orderId}:${form.email}:${total}`} size={150} fgColor="#014D1C" />
        </div>
        <div className="success-btns">
          <button onClick={() => navigate("/orders")}>Buyurtmalarni ko'rish</button>
          <button className="btn-home" onClick={() => navigate("/")}>Bosh sahifaga</button>
        </div>
      </div>
    );
  }

  if (otpSent) {
    return (
      <div className="otp-page">
        <div className="otp-card">
          <div className="otp-icon">📱</div>
          <h2>SMS tasdiqlash</h2>
          <p>{form.phone} raqamiga 6 xonali kod yuborildi</p>
          <div className="otp-inputs">
            {otp.map((v, i) => (
              <input key={i} ref={(el) => (otpRefs.current[i] = el)}
                type="text" inputMode="numeric" maxLength={1} value={v}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className={otpError ? "error" : ""} />
            ))}
          </div>
          {otpError && <p className="otp-error">{otpError}</p>}
          <button className="btn-verify" onClick={verifyOtp} disabled={otp.join("").length < 6}>
            Tasdiqlash
          </button>
          <div className="otp-resend">
            {otpTimer > 0 ? (
              <span>Qayta yuborish: {otpTimer}s</span>
            ) : (
              <button onClick={sendOtp}>Qayta yuborish</button>
            )}
          </div>
          <button className="btn-back-otp" onClick={() => setOtpSent(false)}>← Orqaga</button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) { navigate("/cart"); return null; }

  return (
    <div className="checkout-page">
      <h1>To'lov</h1>
      <div className="checkout-body">
        <div className="checkout-form-wrap">
          <form onSubmit={handleSubmit} className="checkout-form">
            <h2>Ma'lumotlaringiz</h2>
            <label>Ism Familiya
              <input type="text" required placeholder="Ism Familiya" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>Telefon
              <input type="tel" required placeholder="+998 90 000 00 00" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </label>
            <label>Email
              <input type="email" required placeholder="email@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>

            <h2>To'lov usuli</h2>
            <div className="payment-methods">
              {PAYMENT_METHODS.map((m) => (
                <div key={m.id} className={`payment-option ${payment === m.id ? "active" : ""}`}
                  onClick={() => setPayment(m.id)}>
                  <span>{m.icon}</span><span>{m.label}</span>
                </div>
              ))}
            </div>

            {payment === "card" && (
              <div className="card-form">
                <div className="card-preview">
                  <div className="card-preview-top">
                    <span className="card-chip">▬▬</span>
                    <span className="card-type">
                      {card.number.replace(/\s/g, "").startsWith("9860") ? "HUMO" :
                       card.number.replace(/\s/g, "").startsWith("8600") ? "UZCARD" : "💳"}
                    </span>
                  </div>
                  <div className="card-number-display">{card.number || "•••• •••• •••• ••••"}</div>
                  <div className="card-preview-bottom">
                    <span>{card.holder || "KARTA EGASI"}</span>
                    <span>{card.expiry || "MM/YY"}</span>
                  </div>
                </div>
                {cardError && <div className="card-error">⚠️ {cardError}</div>}
                <label>Karta raqami
                  <input type="text" required placeholder="0000 0000 0000 0000" value={card.number}
                    onChange={(e) => { setCard({ ...card, number: formatCardNumber(e.target.value) }); setCardError(""); }} />
                </label>
                <label>Karta egasi
                  <input type="text" required placeholder="ISM FAMILIYA" style={{ textTransform: "uppercase" }}
                    value={card.holder} onChange={(e) => setCard({ ...card, holder: e.target.value.toUpperCase() })} />
                </label>
                <div className="card-row">
                  <label>Muddati
                    <input type="text" required placeholder="MM/YY" value={card.expiry}
                      onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} />
                  </label>
                  <label>CVV
                    <input type="password" required placeholder="•••" maxLength={3} value={card.cvv}
                      onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })} />
                  </label>
                </div>
              </div>
            )}

            {(payment === "click" || payment === "payme") && (
              <div className="phone-pay">
                <label>{payment === "click" ? "Click" : "Payme"} telefon raqami
                  <input type="tel" required placeholder="+998 90 000 00 00" />
                </label>
                <p className="pay-note">📱 Telefonga SMS kod yuboriladi</p>
              </div>
            )}

            {payment === "humo" && (
              <div className="card-form">
                <label>Humo karta raqami
                  <input type="text" required placeholder="9860 •••• •••• ••••" maxLength={19} />
                </label>
                <label>Muddati
                  <input type="text" required placeholder="MM/YY" maxLength={5} />
                </label>
              </div>
            )}

            <div className="promo-row">
              <input placeholder="Promo kod" value={promo} onChange={(e) => setPromo(e.target.value)} />
              <button type="button" onClick={applyPromo}>Qo'llash</button>
            </div>
            {promoMsg && <p className={`promo-msg ${discount > 0 ? "success" : "error"}`}>{promoMsg}</p>}

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
              <div className="summary-item-detail">{item.sector.name} × {item.qty}</div>
              <div className="summary-item-price">{(item.sector.price * item.qty).toLocaleString()} so'm</div>
            </div>
          ))}
          <div className="summary-divider" />
          {discount > 0 && (
            <div className="summary-discount">
              <span>Chegirma ({discount}%):</span>
              <span>-{(subtotal - total).toLocaleString()} so'm</span>
            </div>
          )}
          <div className="summary-total-row">
            <span>Jami:</span>
            <strong>{total.toLocaleString()} so'm</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
