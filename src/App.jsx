import { useEffect, useState } from "react";

export default function App() {
  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem("links");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    localStorage.setItem("links", JSON.stringify(links));
  }, [links]);

  const addLink = () => {
    if (!title || !url) return;

    setLinks([
      {
        id: Date.now(),
        title,
        url,
      },
      ...links,
    ]);

    setTitle("");
    setUrl("");
  };

  const deleteLink = (id) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>🔗 Created by Alex</h1>
        <p style={styles.subtitle}>Crack Links ✨</p>

        {/* FORM */}
        <div style={styles.card}>
          <input
            style={styles.input}
            placeholder="Titre du lien"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button style={styles.button} onClick={addLink}>
            Ajouter
          </button>
        </div>

        {/* LISTE */}
        <div style={styles.list}>
          {links.map((link) => (
            <div key={link.id} style={styles.item}>
              <div>
                <div style={styles.linkTitle}>{link.title}</div>
                <a
                  href={link.url}
                  target="_blank"
                  style={styles.link}
                  rel="noreferrer"
                >
                  {link.url}
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
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "Arial",
  },
  container: {
    width: "100%",
    maxWidth: "700px",
  },
  title: {
    color: "white",
    fontSize: "32px",
    marginBottom: "5px",
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: "25px",
  },
  card: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
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
    cursor: "pointer",
    fontWeight: "bold",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  item: {
    background: "rgba(255,255,255,0.08)",
    padding: "15px",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkTitle: {
    color: "white",
    fontWeight: "bold",
  },
  link: {
    color: "#60a5fa",
    fontSize: "12px",
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
