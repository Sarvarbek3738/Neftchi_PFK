import { useNavigate } from "react-router-dom";
import "./MatchCard.css";

export default function MatchCard({ match }) {
  const navigate = useNavigate();

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
        <span>💰 {Math.min(...match.sectors.map(s => s.price)).toLocaleString()} so'mdan</span>
      </div>
      <button className="btn-buy" onClick={() => navigate(`/match/${match.id}`)}>
        Chipta sotib olish
      </button>
    </div>
  );
}
