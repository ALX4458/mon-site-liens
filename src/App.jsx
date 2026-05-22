import { useEffect, useState } from "react";
import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function App() {
  const [apps, setApps] = useState([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [logo, setLogo] = useState("");

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const login = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User:", result.user);
  } catch (error) {
    console.log("Login error:", error.message);
  }
};

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "apps"), (snapshot) => {
      setApps(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

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

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <button onClick={login} style={styles.login}>
          🔐 Se connecter Google
        </button>

        <h1 style={styles.title}>🔥 Alex Crack</h1>

        <div style={styles.card}>
          <input
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Lien"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <input
            placeholder="Logo URL"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
          />

          <button onClick={addApp}>Ajouter</button>
        </div>

        <div>
          {apps.map((app) => (
            <div key={app.id} style={styles.item}>
              <img src={app.logo} width="40" />
              <div>
                <b>{app.name}</b>
                <br />
                <a href={app.url} target="_blank">
                  ouvrir
                </a>
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
  login: {
    marginBottom: 20,
    padding: 10,
    cursor: "pointer",
  },
};