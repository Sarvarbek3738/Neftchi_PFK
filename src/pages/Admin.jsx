import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection, getDocs, addDoc, deleteDoc, doc, setDoc
} from "firebase/firestore";
import { matches as defaultMatches } from "../data/matches";
import "./Admin.css";

export default function Admin() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ away: "", date: "", time: "", league: "O'zbekiston Superligasi" });
  const [tab, setTab] = useState("matches");

  const orders = JSON.parse(localStorage.getItem("neftchi-orders") || "[]");
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalTickets = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);

  // Firestore dan o'yinlarni yuklash
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const snap = await getDocs(collection(db, "matches"));
        if (snap.empty) {
          // Birinchi marta — default o'yinlarni Firestore ga yozamiz
          for (const m of defaultMatches) {
            await setDoc(doc(db, "matches", String(m.id)), m);
          }
          setMatches(defaultMatches);
        } else {
          setMatches(snap.docs.map((d) => ({ ...d.data(), firestoreId: d.id })));
        }
      } catch (e) {
        console.error(e);
        setMatches(defaultMatches);
      }
      setLoading(false);
    };
    fetchMatches();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const newMatch = {
      home: "Neftchi PFK",
      away: form.away,
      date: form.date,
      time: form.time,
      stadium: "Neftchi Arena, Toshkent",
      league: form.league,
      sectors: [
        { id: "vip", name: "VIP", price: 150000, available: 50 },
        { id: "tribuna-a", name: "Tribuna A", price: 80000, available: 200 },
        { id: "tribuna-b", name: "Tribuna B", price: 50000, available: 300 },
        { id: "fan-zone", name: "Fan Zone", price: 30000, available: 500 },
      ],
    };
    const ref = await addDoc(collection(db, "matches"), newMatch);
    setMatches([...matches, { ...newMatch, firestoreId: ref.id }]);
    setForm({ away: "", date: "", time: "", league: "O'zbekiston Superligasi" });
  };

  const handleDelete = async (firestoreId) => {
    await deleteDoc(doc(db, "matches", firestoreId));
    setMatches(matches.filter((m) => m.firestoreId !== firestoreId));
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>⚙️ Admin Panel</h1>
        <p>Neftchi PFK boshqaruv tizimi</p>
      </div>

      <div className="admin-tabs">
        <button className={tab === "matches" ? "active" : ""} onClick={() => setTab("matches")}>O'yinlar</button>
        <button className={tab === "stats" ? "active" : ""} onClick={() => setTab("stats")}>Statistika</button>
        <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>Buyurtmalar</button>
      </div>

      {tab === "matches" && (
        <div className="admin-body">
          <div className="admin-form-wrap">
            <h2>Yangi o'yin qo'shish</h2>
            <form onSubmit={handleAdd} className="admin-form">
              <input required placeholder="Raqib jamoasi" value={form.away}
                onChange={(e) => setForm({ ...form, away: e.target.value })} />
              <input required type="date" value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <input required type="time" value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })} />
              <input placeholder="Liga" value={form.league}
                onChange={(e) => setForm({ ...form, league: e.target.value })} />
              <button type="submit">+ Qo'shish</button>
            </form>
          </div>

          <div className="admin-matches">
            <h2>O'yinlar ro'yxati ({matches.length})</h2>
            {loading ? <p>Yuklanmoqda...</p> : matches.map((m) => (
              <div key={m.firestoreId || m.id} className="admin-match-row">
                <div>
                  <strong>{m.home} vs {m.away}</strong>
                  <span>{m.date} {m.time} | {m.league}</span>
                </div>
                <button className="btn-delete" onClick={() => handleDelete(m.firestoreId || String(m.id))}>🗑️</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "stats" && (
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">🎟️</div>
            <div className="stat-value">{totalTickets}</div>
            <div className="stat-label">Sotilgan chiptalar</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-value">{totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Jami daromad (so'm)</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-value">{orders.length}</div>
            <div className="stat-label">Buyurtmalar soni</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚽</div>
            <div className="stat-value">{matches.length}</div>
            <div className="stat-label">Rejalashtirilgan o'yinlar</div>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="admin-orders">
          <h2>Barcha buyurtmalar ({orders.length})</h2>
          {orders.length === 0 ? (
            <p className="no-data">Hali buyurtma yo'q</p>
          ) : orders.map((order, i) => (
            <div key={i} className="admin-order-card">
              <div className="order-top">
                <span className="order-id">#{order.id}</span>
                <span className="order-date">{order.date}</span>
                <span className="order-email">{order.email}</span>
                <span className="order-total-badge">{order.total.toLocaleString()} so'm</span>
              </div>
              {order.items.map((item, j) => (
                <div key={j} className="admin-order-item">
                  {item.match.home} vs {item.match.away} — {item.sector.name} × {item.qty}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
