import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>No experiment lives at this address.</p>
      <Link to="/">← Back to all experiments</Link>
    </div>
  );
}
