import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { blogApi, userApi } from '../api/endpoints';
import EntryCard from '../components/EntryCard';
import Avatar from '../components/Avatar';
import { EmptyState, ErrorState, EntrySkeletons } from '../components/States';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [input, setInput] = useState(q);
  const [state, setState] = useState({ loading: false, error: null, blogs: [], people: [] });
  const debounceRef = useRef(null);

  async function runSearch(term) {
    if (!term) {
      setState({ loading: false, error: null, blogs: [], people: [] });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [blogs, people] = await Promise.all([
        blogApi.search(term),
        userApi.search(term).catch(() => [])
      ]);
      setState({
        loading: false,
        error: null,
        blogs: [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        people
      });
    } catch (e) {
      setState({ loading: false, error: e.message, blogs: [], people: [] });
    }
  }

  useEffect(() => {
    runSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function handleChange(e) {
    const v = e.target.value;
    setInput(v);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setParams(v.trim() ? { q: v.trim() } : {});
    }, 380);
  }

  const hasResults = state.blogs.length > 0 || state.people.length > 0;

  return (
    <div className="wrap">
      <div className="hero compact">
        <h1>Find something to read</h1>
        <p className="tag">Search by title, content, or a writer's username.</p>
      </div>
      <div className="field" style={{ maxWidth: 420 }}>
        <input
          type="search"
          placeholder="Try “travel”, “cooking”, a name…"
          value={input}
          onChange={handleChange}
        />
      </div>

      {state.error ? (
        <ErrorState message={state.error} onRetry={() => runSearch(q)} />
      ) : !q ? (
        <EmptyState title="Search BackendBytes" body="Start typing to find posts or writers." />
      ) : state.loading ? (
        <EntrySkeletons count={3} />
      ) : !hasResults ? (
        <EmptyState title="Nothing found" body="Try a different search term." />
      ) : (
        <>
          {state.people.length > 0 && (
            <>
              <div className="section-label" style={{ margin: '18px 0 10px' }}>
                Writers
              </div>
              <div className="people-list">
                {state.people.slice(0, 5).map((u) => (
                  <Link className="person-row" to={`/profile/${encodeURIComponent(u.username)}`} key={u.id}>
                    <Avatar firstName={u.firstName} lastName={u.lastName} username={u.username} profileImage={u.profileImage} />
                    <div className="who">
                      <div className="name">
                        {u.firstName} {u.lastName}
                      </div>
                      <div className="uname">@{u.username}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
          {state.blogs.length > 0 && (
            <>
              <div className="section-label" style={{ margin: '22px 0 10px' }}>
                Posts
              </div>
              <div className="entry-list">
                {state.blogs.map((b, i) => (
                  <EntryCard blog={b} index={i} key={b.id} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
