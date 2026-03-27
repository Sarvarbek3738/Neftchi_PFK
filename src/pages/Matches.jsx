import { matches } from "../data/matches";
import MatchCard from "../components/MatchCard";
import "./Matches.css";

export default function Matches() {
  return (
    <div className="matches-page">
      <div className="matches-header">
        <h1>Barcha o'yinlar</h1>
        <p>Neftchi PFK 2026 mavsumi</p>
      </div>
      <div className="matches-container">
        <div className="matches-grid">
          {matches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      </div>
    </div>
  );
}
