import { Link } from "react-router-dom";
import { experiments } from "../experiments";

export default function Home() {
  return (
    <div className="home">
      <header className="home-hero">
        <h1>🧪 Nerdspcae - Exploring Techs</h1>
        <p>
          A playground for trying libraries in the browser. Pick a tool below.
        </p>
      </header>

      <div className="experiment-grid">
        {experiments.map((exp) => (
          <Link key={exp.id} to={`/${exp.id}`} className="experiment-card">
            <div className="experiment-icon">{exp.icon}</div>
            <h2>{exp.title}</h2>
            <p>{exp.description}</p>
            <div className="experiment-tags">
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
