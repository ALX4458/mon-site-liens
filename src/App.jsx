import { useEffect, useMemo, useState } from "react";
import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export default function App() {
  const [apps, setApps] = useState([]);
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [logo, setLogo] = useState("");
  const [category, setCategory] = useState("Tools");

  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "apps"), (snap) => {
      setApps(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const login = () => signInWithPopup(auth, provider);
  const logout = () => signOut(auth);

  const addApp = async () => {
    if (!name || !url || !logo) return;

    await addDoc(collection(db, "apps"), {
      name,
      url,
      logo,
      category,
    });

    setName("");
    setUrl("");
    setLogo("");
  };

  const remove = async (id) => {
    await deleteDoc(doc(db, "apps", id));
  };

  const toggleFav = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id]
    );
  };

  const filtered = useMemo(() => {
    return apps.filter((a) =>
      a.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [apps, search]);

  if (!user) {
    return (
      <div style={styles.bg(dark)}>
        <div style={styles.loginCard}>
          <h1>🔥 Alex Crack</h1>
          <button onClick={login} style={styles.primaryBtn}>
            Login Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.bg(dark)}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <h1>🔥 Alex Crack</h1>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setDark(!dark)}>
              {dark ? "🌞" : "🌙"}
            </button>

            <button onClick={logout}>Logout</button>
          </div>
        </div>

        {/* SEARCH */}
        <input
          placeholder="🔎 Search..."
          style={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FORM */}
        <div style={styles.form}>
          <input placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Lien" value={url} onChange={(e) => setUrl(e.target.value)} />
          <input placeholder="Logo URL" value={logo} onChange={(e) => setLogo(e.target.value)} />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Tools</option>
            <option>Adobe</option>
            <option>Dev</option>
            <option>Other</option>
          </select>

          <button onClick={addApp} style={styles.primaryBtn}>
            + Add
          </button>
        </div>

        {/* GRID */}
        <div style={styles.grid}>
          {filtered.map((app) => (
            <div key={app.id} style={styles.card(dark)}>

              <img src={app.logo} style={styles.logo} />

              <div style={{ flex: 1 }}>
                <b>{app.name}</b>
                <div style={{ fontSize: 12, opacity: 0.6 }}>
                  {app.category}
                </div>

                <a href={app.url} target="_blank">
                  Open →
                </a>
              </div>

              <button onClick={() => toggleFav(app.id)}>
                ⭐
              </button>

              <button onClick={() => remove(app.id)}>
                ✕
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* 🎨 STYLE PRO */
const styles = {
  bg: (dark) => ({
    minHeight: "100vh",
    padding: 30,
    color: "white",
    background: dark
      ? "linear-gradient(135deg,#0f0f0f,#1b1b1b)"
      : "linear-gradient(135deg,#f5f5f5,#ffffff)",
  }),

  container: {
    maxWidth: 900,
    margin: "auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  search: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },

  form: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 20,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: 15,
  },

  card: (dark) => ({
    display: "flex",
    gap: 10,
    padding: 12,
    borderRadius: 16,
    background: dark ? "rgba(255,255,255,0.05)" : "white",
  }),

  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },

  primaryBtn: {
    padding: 10,
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: 10,
  },
};