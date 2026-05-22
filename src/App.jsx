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

  // 🔐 AUTH STATE
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubAuth();
  }, []);

  // 🌍 DATA
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "apps"), (snapshot) => {
      setApps(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  const login = async () => {
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

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

  const deleteApp = async (id) => {
    await deleteDoc(doc(db, "apps", id));
  };

  // 🔐 ECRAN LOGIN
  if (!user) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginBox}>
          <h1>🔥 Alex Crack</h1>
          <p>Connecte-toi pour accéder au site</p>

          <button style={styles.loginBtn} onClick={login}>
            🔐 Se connecter avec Google
          </button>
        </div>
      </div>
    );
  }

  // 🌍 SITE NORMAL
  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.topBar}>
          <h1>🔥 Alex Crack</h1>
          <button onClick={logout}>Déconnexion</button>
        </div>

        <div style={styles.card}>
          <input placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Lien" value={url} onChange={(e) => setUrl(e.target.value)} />
          <input placeholder="Logo URL" value={logo} onChange={(e) => setLogo(e.target.value)} />

          <button onClick={addApp}>Ajouter</button>
        </div>

        <div>
          {apps.map((app) => (
            <div key={app.id} style={styles.item}>
              <img src={app.logo} width="40" />
              <div>
                <b>{app.name}</b>
                <br />
                <a href={app.url} target="_blank">ouvrir</a>
              </div>
              <button onClick={() => deleteApp(app.id)}>X</button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const styles = {
  loginPage: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#111",
    color: "white",
  },
  loginBox: {
    textAlign: "center",
    padding: 40,
    borderRadius: 20,
    background: "#1f1f1f",
  },
  loginBtn: {
    padding: 12,
    marginTop: 20,
    cursor: "pointer",
  },
  page: {
    padding: 30,
    background: "#111",
    color: "white",
    minHeight: "100vh",
  },
  container: {
    maxWidth: 700,
    margin: "auto",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 20,
  },
  item: {
    display: "flex",
    gap: 10,
    marginBottom: 10,
    alignItems: "center",
  },
};