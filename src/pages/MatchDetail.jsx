import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { matches } from "../data/matches";
import "./MatchDetail.css";

export default function MatchDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const match = matches.find((m) => m.id === parseInt(id));
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!match) return <div className="not-found">O'yin topilmadi</div>;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });
  };

  const handleAdd = () => {
    if (!selected) return;
    addToCart({ match, sector: selected, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Orqaga</button>
        <div className="detail-league">{match.league}</div>
        <div className="detail-teams">
          <span>{match.home}</span>
          <span className="detail-vs">VS</span>
          <span>{match.away}</span>
        </div>
        <div className="detail-meta">
          <span>📅 {formatDate(match.date)}</span>
          <span>⏰ {match.time}</span>
          <span>📍 {match.stadium}</span>
        </div>
      </div>

      <div className="detail-body">
        <h2>Sektor tanlang</h2>
        <div className="sectors-grid">
          {match.sectors.map((sector) => (
            <div
              key={sector.id}
              className={`sector-card ${selected?.id === sector.id ? "active" : ""}`}
              onClick={() => setSelected(sector)}
            >
              <div className="sector-name">{sector.name}</div>
              <div className="sector-price">{sector.price.toLocaleString()} so'm</div>
              <div className="sector-available">{sector.available} joy mavjud</div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="ticket-order">
            <h3>Chipta soni</h3>
            <div className="qty-control">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(selected.available, qty + 1))}>+</button>
            </div>
            <div className="order-total">
              Jami: <strong>{(selected.price * qty).toLocaleString()} so'm</strong>
            </div>
            <button className="btn-add-cart" onClick={handleAdd}>
              {added ? "✅ Savatga qo'shildi!" : "Savatga qo'shish"}
            </button>
            <button className="btn-view-cart" onClick={() => navigate("/cart")}>
              Savatni ko'rish 🛒
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
