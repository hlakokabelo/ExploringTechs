import { Link } from "react-router-dom";
import { techs } from "../techs";

export default function Home() {
  return (
    <div className="home">
      <header className="home-hero">
        <h1>🧪 Exploring Techs</h1>
        <p>
          A playground for trying libraries in the browser. Pick a tool below.
        </p>
      </header>

      <div className="tech-grid">
        {techs.map((exp) => (
          <Link key={exp.id} to={`/${exp.id}`} className="tech-card">
            <div className="tech-icon">{exp.icon}</div>
            <h2>{exp.title}</h2>
            <p>{exp.description}</p>
            <div className="tech-tags">
              {exp.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
