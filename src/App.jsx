const apps = [
  {
    name: "VS Code",
    logo: "/logos/vscode.png",
    link: "https://code.visualstudio.com/"
  },
  {
    name: "GitHub",
    logo: "/logos/github.png",
    link: "https://github.com/"
  }
];

export default function Home() {
  return (
    <div className="grid">
      {apps.map((app) => (
        <a key={app.name} href={app.link} target="_blank" className="card">
          <img src={app.logo} alt={app.name} />
          <h3>{app.name}</h3>
        </a>
      ))}
    </div>
  );
}