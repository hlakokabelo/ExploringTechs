import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  title: string;
  icon: string;
  children: ReactNode;
}

export function ExperimentLayout({ title, icon, children }: Props) {
  return (
    <div className="experiment-layout">
      <nav className="experiment-nav">
        <Link to="/">← All experiments</Link>
        <span className="experiment-title">
          {icon} {title}
        </span>
      </nav>
      <main className="experiment-body">{children}</main>
    </div>
  );
}
