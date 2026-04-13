import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const orders = JSON.parse(localStorage.getItem("neftchi-orders") || "[]");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) { navigate("/login"); return null; }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">{user.name[0].toUpperCase()}</div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Chiqish</button>
      </div>

      <div className="profile-body">
        <h2>Buyurtmalar tarixi</h2>
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>Hali buyurtma yo'q</p>
            <button onClick={() => navigate("/matches")}>Chipta sotib olish</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, i) => (
              <div key={i} className="order-card">
                <div className="order-date">📅 {order.date}</div>
                {order.items.map((item, j) => (
                  <div key={j} className="order-item">
                    <span>{item.match.home} vs {item.match.away}</span>
                    <span>{item.sector.name} × {item.qty}</span>
                    <span className="order-price">{(item.sector.price * item.qty).toLocaleString()} so'm</span>
                  </div>
                ))}
                <div className="order-total">Jami: <strong>{order.total.toLocaleString()} so'm</strong></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
