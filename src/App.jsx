import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

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
  const [favorites, setFavorites] = useState([]);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const ADMIN_EMAIL = "tonmail@gmail.com";
  const isAdmin = user?.email === ADMIN_EMAIL;

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
    if (!isAdmin) return;
    if (!name || !url || !logo) return;

    await addDoc(collection(db, "apps"), {
      name,
      url,
      logo,
      category,
      createdAt: Date.now(),
    });

    setName("");
    setUrl("");
    setLogo("");
  };

  const remove = async (id) => {
    if (!isAdmin) return;
    await deleteDoc(doc(db, "apps", id));
  };

  const toggleFav = (id) => {
    setFavorites((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  };

  const filtered = useMemo(() => {
    let list = apps;

    if (view === "software") list = list.filter(a => a.category === "Software");
    if (view === "torrents") list = list.filter(a => a.category === "Torrents");
    if (view === "adobe") list = list.filter(a => a.category === "Adobe");

    return list.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [apps, search, view]);

  if (!user) {
    return (
      <div style={styles.bg}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={styles.login}>
          <h1>⚡ Alex Hub</h1>
          <button style={styles.btn} onClick={login}>
            🔐 Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={styles.bg}>
      <div style={styles.container}>

        <div style={styles.header}>
          <h1>⚡ Alex Hub</h1>
          <button onClick={logout}>Logout</button>
        </div>

        <div style={styles.nav}>
          <button onClick={() => setView("all")}>🌍 All</button>
          <button onClick={() => setView("software")}>💻 Software</button>
          <button onClick={() => setView("torrents")}>📦 Torrents</button>
          <button onClick={() => setView("adobe")}>🎨 Adobe</button>
        </div>

        <input
          style={styles.search}
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {isAdmin && (
          <div style={styles.admin}>
            <h3>Admin Panel</h3>

            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
            <input placeholder="Logo" value={logo} onChange={(e) => setLogo(e.target.value)} />

            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Software">Software</option>
              <option value="Torrents">Torrents</option>
              <option value="Adobe">Adobe</option>
            </select>

            <button onClick={addApp} style={styles.btn}>+ Add</button>
          </div>
        )}

        <div style={styles.grid}>
          {filtered.map((app) => (
            <motion.div
              key={app.id}
              whileHover={{ scale: 1.05 }}
              style={styles.card}
            >
              <img src={app.logo} style={styles.logo} />

              <div style={{ flex: 1 }}>
                <b>{app.name}</b>
                <div style={styles.tag}>{app.category}</div>
                <a href={app.url} target="_blank">Open →</a>
              </div>

              <button onClick={() => toggleFav(app.id)}>⭐</button>

              {isAdmin && (
                <button onClick={() => remove(app.id)}>✕</button>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    padding: 30,
    color: "white",
    background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
  },

  container: { maxWidth: 1000, margin: "auto" },

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
  },

  admin: {
    padding: 15,
    borderRadius: 16,
    background: "rgba(255,255,255,0.08)",
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
    gap: 15,
  },

  card: {
    display: "flex",
    gap: 12,
    padding: 14,
    borderRadius: 18,
    background: "rgba(255,255,255,0.08)",
  },

  logo: {
    width: 42,
    height: 42,
    borderRadius: 10,
  },

  tag: {
    fontSize: 12,
    opacity: 0.6,
  },

  btn: {
    padding: 10,
    background: "#7c3aed",
    color: "white",
    border: "none",
    borderRadius: 10,
  },

  login: {
    textAlign: "center",
    padding: 50,
    borderRadius: 20,
    background: "rgba(255,255,255,0.08)",
  },
};