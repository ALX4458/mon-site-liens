import { useEffect, useState } from "react";

export default function App() {
  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem("links");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    localStorage.setItem("links", JSON.stringify(links));
  }, [links]);

  const addLink = () => {
    if (!title || !url || !image) return;

    const newLink = {
      id: Date.now(),
      title,
      url,
      image,
    };

    setLinks([newLink, ...links]);

    setTitle("");
    setUrl("");
    setImage("");
  };

  const deleteLink = (id) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>🔗 Mon bibliothèque de logiciels</h1>
        <p style={styles.subtitle}>Style App Store / Notion ✨</p>

        {/* FORM */}
        <div style={styles.card}>
          <input
            style={styles.input}
            placeholder="Nom du logiciel (ex: Photoshop)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Lien du site"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="URL du logo (image)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <button style={styles.button} onClick={addLink}>
            Ajouter
          </button>
        </div>

        {/* LISTE */}
        <div style={styles.grid}>
          {links.map((link) => (
            <div key={link.id} style={styles.item}>
              <img src={link.image} style={styles.logo} />

              <div style={{ flex: 1 }}>
                <div style={styles.name}>{link.title}</div>

                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.link}
                >
                  Ouvrir le site →
                </a>
              </div>

              <button
                style={styles.delete}
                onClick={() => deleteLink(link.id)}
              >
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
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #1f2937, #0f172a)",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "Arial",
  },
  container: {
    width: "100%",
    maxWidth: "800px",
  },
  title: {
    color: "white",
    fontSize: "32px",
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: "20px",
  },
  card: {
    background: "rgba(255,255,255,0.08)",
    padding: "20px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
  },
  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "12px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  logo: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    objectFit: "cover",
  },
  name: {
    color: "white",
    fontWeight: "bold",
  },
  link: {
    color: "#60a5fa",
    fontSize: "13px",
    textDecoration: "none",
  },
  delete: {
    background: "transparent",
    border: "none",
    color: "#f87171",
    fontSize: "18px",
    cursor: "pointer",
  },
};