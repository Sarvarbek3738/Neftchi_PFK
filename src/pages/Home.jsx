import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMatches } from "../hooks/useMatches";
import MatchCard from "../components/MatchCard";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { matches, loading } = useMatches();

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroSubtitle")}</p>
          <button className="hero-btn" onClick={() => navigate("/matches")}>
            {t("allMatches")}
          </button>
        </div>
      </div>

      <div className="section">
        <h2>{t("upcomingMatches")}</h2>
        {loading ? (
          <div className="loading-msg">Yuklanmoqda...</div>
        ) : (
          <div className="matches-grid">
            {matches.slice(0, 2).map((m) => (
              <MatchCard key={m.firestoreId || m.id} match={m} />
            ))}
          </div>
        )}
        <button className="btn-all" onClick={() => navigate("/matches")}>
          {t("allMatches")}
        </button>
      </div>
    </div>
  );
}
