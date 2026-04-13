import { useTranslation } from "react-i18next";
import { useMatches } from "../hooks/useMatches";
import MatchCard from "../components/MatchCard";
import "./Matches.css";

export default function Matches() {
  const { t } = useTranslation();
  const { matches, loading } = useMatches();

  return (
    <div className="matches-page">
      <div className="matches-header">
        <h1>{t("matches")}</h1>
        <p>Neftchi PFK 2026</p>
      </div>
      <div className="matches-container">
        {loading ? (
          <div className="loading-msg">Yuklanmoqda...</div>
        ) : (
          <div className="matches-grid">
            {matches.map((m) => (
              <MatchCard key={m.firestoreId || m.id} match={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
