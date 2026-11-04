import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  title: string;
  icon: string;
  children: ReactNode;
}

export function TechLayout({ title, icon, children }: Props) {
  return (
    <div className="tech-layout">
      <nav className="tech-nav">
        <Link to="/">← All techs</Link>
        <span className="tech-title">
          {icon} {title}
        </span>
      </nav>
      <main className="tech-body">{children}</main>
    </div>
  );
}
