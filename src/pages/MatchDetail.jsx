import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMatches } from "../hooks/useMatches";
import "./MatchDetail.css";

export default function MatchDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { matches } = useMatches();
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const match = matches.find((m) => String(m.firestoreId) === id || String(m.id) === id);

  if (!match) return <div className="not-found">Yuklanmoqda...</div>;

  const formatDate = (dateStr) => dateStr;

  const handleAdd = () => {
    if (!selected) return;
    addToCart({ match, sector: selected, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="detail-page">
      <div className="detail-header">
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
        <h2>{t("selectSector")}</h2>
        <div className="sectors-grid">
          {match.sectors.map((sector) => (
            <div key={sector.id}
              className={`sector-card ${selected?.id === sector.id ? "active" : ""}`}
              onClick={() => setSelected(sector)}>
              <div className="sector-name">{sector.name}</div>
              <div className="sector-price">{sector.price.toLocaleString()} {t("som")}</div>
              <div className="sector-available">{sector.available} {t("available")}</div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="ticket-order">
            <h3>{t("ticketCount")}</h3>
            <div className="qty-control">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(selected.available, qty + 1))}>+</button>
            </div>
            <div className="order-total">
              {t("total")}: <strong>{(selected.price * qty).toLocaleString()} {t("som")}</strong>
            </div>
            <button className="btn-add-cart" onClick={handleAdd} disabled={added}>
              {added ? t("added") : t("addToCart")}
            </button>
            <button className="btn-view-cart" onClick={() => navigate("/cart")}>
              {t("viewCart")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
