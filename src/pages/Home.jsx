import { useNavigate } from "react-router-dom";
import { matches } from "../data/matches";
import MatchCard from "../components/MatchCard";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>Neftchi PFK</h1>
          <p>Eng yaxshi o'rinlarni hoziroq band qiling</p>
          <button className="hero-btn" onClick={() => navigate("/matches")}>
            O'yinlarni ko'rish
          </button>
        </div>
      </div>

      <div className="section">
        <h2>Yaqinlashayotgan o'yinlar</h2>
        <div className="matches-grid">
          {matches.slice(0, 2).map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
        <button className="btn-all" onClick={() => navigate("/matches")}>
          Barcha o'yinlarni ko'rish →
        </button>
      </div>
    </div>
  );
}
