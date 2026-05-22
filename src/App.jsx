import { useEffect, useState, useMemo } from "react";
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
  const [category, setCategory] = useState("Software");

  const [view, setView] = useState("all");
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
    let list = apps;

    if (view === "software") {
      list = list.filter((a) => a.category === "Software");
    }

    if (view === "torrents") {
      list = list.filter((a) => a.category === "Torrents");
    }

    if (view === "adobe") {
      list = list.filter((a) => a.category === "Adobe");
    }

    return list.filter((a) =>
      a.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [apps, search, view]);

  if (!user) {
    return (
      <div style={styles.bg(dark)}>
        <div style={styles.loginCard}>
          <h1>🔥 Alex Crack</h1>
          <p style={{ opacity: 0.6 }}>Accès privé</p>

          <button onClick={login} style={styles.primaryBtn}>
            🔐 Login Google
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

        {/* NAV TABS */}
        <div style={styles.nav}>
          <button onClick={() => setView("all")}>🌍 Tout</button>
          <button onClick={() => setView("software")}>💻 Logiciels</button>
          <button onClick={() => setView("torrents")}>📦 Torrents</button>
          <button onClick={() => setView("adobe")}>🎨 Adobe</button>
        </div>

        {/* SEARCH */}
        <input
          placeholder="🔎 Search apps..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        {/* FORM */}
        <div style={styles.form}>
          <input placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Lien" value={url} onChange={(e) => setUrl(e.target.value)} />
          <input placeholder="Logo URL" value={logo} onChange={(e) => setLogo(e.target.value)} />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Software">💻 Software</option>
            <option value="Torrents">📦 Torrents</option>
            <option value="Adobe">🎨 Adobe</option>
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

                <div style={styles.tag}>{app.category}</div>

                <a href={app.url} target="_blank" style={styles.link}>
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

/* 🎨 ULTRA DESIGN */
const styles = {
  bg: (dark) => ({
    minHeight: "100vh",
    padding: 30,
    color: "white",
    background: dark
      ? "radial-gradient(circle at top,#1b1b1b,#0f0f0f)"
      : "linear-gradient(135deg,#f5f5f5,#ffffff)",
    transition: "0.3s",
  }),

  container: { maxWidth: 950, margin: "auto" },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  nav: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
  },

  search: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    border: "none",
    outline: "none",
  },

  form: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 25,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 15,
  },

  card: (dark) => ({
    display: "flex",
    gap: 12,
    padding: 14,
    borderRadius: 18,
    background: dark
      ? "rgba(255,255,255,0.06)"
      : "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    transition: "0.3s",
    transform: "scale(1)",
  }),

  logo: {
    width: 42,
    height: 42,
    borderRadius: 10,
  },

  tag: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },

  link: {
    display: "block",
    marginTop: 5,
    color: "#60a5fa",
    textDecoration: "none",
  },

  primaryBtn: {
    padding: 10,
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: 10,
  },

  loginCard: {
    textAlign: "center",
    padding: 50,
    borderRadius: 20,
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(10px)",
  },
};