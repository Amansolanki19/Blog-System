import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="wrap">
      <div className="empty">
        <h3>Page not found</h3>
        <p>That page doesn't exist.</p>
        <Link className="btn btn-primary" to="/">
          Back to feed
        </Link>
      </div>
    </div>
  );
}
