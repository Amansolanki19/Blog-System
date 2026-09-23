export function Spinner() {
  return (
    <div className="center-spin">
      <div className="spinner" />
    </div>
  );
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      {body && <p>{body}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="empty">
      <h3>Couldn't load that</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-ghost" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EntrySkeletons({ count = 4 }) {
  return (
    <div className="entry-list">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skel-block" key={i}>
          <div className="skel skel-line" style={{ width: 120, height: 11 }} />
          <div className="skel skel-line" style={{ width: '70%', height: 22, marginTop: 10 }} />
          <div className="skel skel-line" style={{ width: '95%' }} />
          <div className="skel skel-line" style={{ width: '60%' }} />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="skel-block">
      <div className="skel skel-line" style={{ width: '40%' }} />
      <div className="skel skel-line" style={{ height: 34, width: '80%', marginTop: 10 }} />
      <div className="skel skel-line" />
      <div className="skel skel-line" />
      <div className="skel skel-line" style={{ width: '70%' }} />
    </div>
  );
}
