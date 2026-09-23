export function initials(first, last, username) {
  if (first || last) {
    return ((first || '')[0] || '').toUpperCase() + ((last || '')[0] || '').toUpperCase();
  }
  return (username || '?').slice(0, 2).toUpperCase();
}

export function timeAgo(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 86400 * 30) return Math.floor(diff / 86400) + 'd ago';
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
}

export function readTime(content) {
  const words = (content || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function excerpt(content, n) {
  const c = (content || '').replace(/\s+/g, ' ').trim();
  return c.length > n ? c.slice(0, n).trim() + '…' : c;
}

export function paragraphs(content) {
  return (content || '').split(/\n+/).filter(Boolean);
}
