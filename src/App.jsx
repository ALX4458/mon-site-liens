export default function App() {
  const apps = [
    {
      name: "GitHub",
      logo: "/logos/github.png",
      link: "https://github.com"
    },
    {
      name: "VS Code",
      logo: "/logos/vscode.png",
      link: "https://code.visualstudio.com"
    }
  ];

  return (
    <div style={styles.grid}>
      {apps.map((app) => (
        <a
          key={app.name}
          href={app.link}
          target="_blank"
          style={styles.card}
        >
          <img src={app.logo} alt={app.name} style={styles.img} />
          <h3>{app.name}</h3>
        </a>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    padding: "20px"
  },
  card: {
    textDecoration: "none",
    color: "black",
    background: "#f5f5f5",
    padding: "15px",
    borderRadius: "12px",
    textAlign: "center"
  },
  img: {
    width: "60px",
    height: "60px",
    objectFit: "contain"
  }
};