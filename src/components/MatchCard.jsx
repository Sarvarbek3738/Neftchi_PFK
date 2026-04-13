import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./MatchCard.css";

export default function MatchCard({ match }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="match-card">
      <div className="match-league">{match.league}</div>
      <div className="match-teams">
        <span className="team home">{match.home}</span>
        <span className="vs">VS</span>
        <span className="team away">{match.away}</span>
      </div>
      <div className="match-info">
        <span>📅 {formatDate(match.date)}</span>
        <span>⏰ {match.time}</span>
        <span>📍 {match.stadium}</span>
      </div>
      <div className="match-prices">
        💰 {Math.min(...match.sectors.map(s => s.price)).toLocaleString()} {t("from")}
      </div>
      <button className="btn-buy" onClick={() => navigate(`/match/${match.firestoreId || match.id}`)}>
        {t("buyTicket")}
      </button>
    </div>
  );
}
