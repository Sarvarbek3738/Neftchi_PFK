import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import "./Orders.css";

export default function Orders() {
  const navigate = useNavigate();
  const orders = JSON.parse(localStorage.getItem("neftchi-orders") || "[]");

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <div>🎟️</div>
        <h2>Buyurtmalar yo'q</h2>
        <button onClick={() => navigate("/matches")}>Chipta sotib olish</button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>Mening buyurtmalarim</h1>
      {orders.map((order, i) => (
        <div key={i} className="order-card">
          <div className="order-header">
            <span className="order-id">#{order.id}</span>
            <span className="order-date">{order.date}</span>
            <span className="order-total">{order.total.toLocaleString()} so'm</span>
          </div>
          {order.items.map((item, j) => (
            <div key={j} className="order-item">
              <div>
                <strong>{item.match.home} vs {item.match.away}</strong>
                <span>{item.match.date} | {item.sector.name} × {item.qty}</span>
              </div>
              <div className="order-qr">
                <QRCodeSVG
                  value={`NEFTCHI:${order.id}:${item.match.home}-${item.match.away}:${item.sector.name}:${item.qty}`}
                  size={80}
                  fgColor="#014D1C"
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
