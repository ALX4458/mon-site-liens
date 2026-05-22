import { useEffect, useState } from "react";
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
    });

    setName("");
    setUrl("");
    setLogo("");
  };

  const remove = async (id) => {
    await deleteDoc(doc(db, "apps", id));
  };

  if (!user) {
    return (
      <div style={styles.bg}>
        <div style={styles.loginCard}>
          <h1 style={styles.title}>Alex Crack</h1>
          <p style={styles.sub}>Accès privé</p>

          <button style={styles.primaryBtn} onClick={login}>
            🔐 Se connecter avec Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.bg}>
      <div style={styles.container}>

        <div style={styles.header}>
          <h1 style={styles.title}>Alex Crack</h1>
          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>

        <div style={styles.formCard}>
          <input style={styles.input} placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
          <input style={styles.input} placeholder="Lien" value={url} onChange={(e) => setUrl(e.target.value)} />
          <input style={styles.input} placeholder="Logo URL" value={logo} onChange={(e) => setLogo(e.target.value)} />

          <button style={styles.primaryBtn} onClick={addApp}>
            + Ajouter
          </button>
        </div>

        <div style={styles.grid}>
          {apps.map((app) => (
            <div key={app.id} style={styles.card}>
              <img src={app.logo} style={styles.logo} />
              <div>
                <h3 style={styles.appName}>{app.name}</h3>
                <a href={app.url} target="_blank" style={styles.link}>
                  Ouvrir →
                </a>
              </div>

              <button style={styles.deleteBtn} onClick={() => remove(app.id)}>
                ✕
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#0f0f0f,#1b1b1b)",
    color: "white",
    display: "flex",
    justifyContent: "center",
    padding: 30,
  },
  container: {
    width: "100%",
    maxWidth: 900,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  sub: {
    opacity: 0.6,
  },
  loginCard: {
    background: "rgba(255,255,255,0.05)",
    padding: 40,
    borderRadius: 20,
    textAlign: "center",
    backdropFilter: "blur(10px)",
  },
  formCard: {
    background: "rgba(255,255,255,0.05)",
    padding: 20,
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 25,
    backdropFilter: "blur(10px)",
  },
  input: {
    padding: 12,
    borderRadius: 10,
    border: "none",
    outline: "none",
  },
  primaryBtn: {
    padding: 12,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "#4f46e5",
    color: "white",
    fontWeight: "bold",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid white",
    color: "white",
    padding: "8px 12px",
    borderRadius: 10,
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: 15,
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    padding: 15,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    gap: 12,
    backdropFilter: "blur(10px)",
    position: "relative",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  appName: {
    margin: 0,
  },
  link: {
    color: "#60a5fa",
    textDecoration: "none",
  },
  deleteBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: 16,
  },
};