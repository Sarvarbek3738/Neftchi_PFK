import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { matches as defaultMatches } from "../data/matches";

export function useMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(collection(db, "matches"));
        if (!snap.empty) {
          setMatches(snap.docs.map((d) => ({ ...d.data(), firestoreId: d.id })));
        } else {
          setMatches(defaultMatches);
        }
      } catch {
        setMatches(defaultMatches);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { matches, loading };
}
