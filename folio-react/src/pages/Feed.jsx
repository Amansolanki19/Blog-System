import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import EntryCard from '../components/EntryCard';
import { EmptyState, ErrorState, EntrySkeletons } from '../components/States';
import Avatar from '../components/Avatar';
import { CommentIcon, HeartIcon, HomeIcon, PencilIcon, SearchIcon, SettingsIcon, UserIcon } from '../components/Icons';
import { excerpt, timeAgo } from '../utils/format';

function createActivityPoints(blogs) {
  const points = Array.from({ length: 15 }, () => 0);
  const now = Date.now();
  blogs.forEach((blog) => {
    const ageDays = Math.max(0, Math.floor((now - new Date(blog.createdAt).getTime()) / 86400000));
    const bucket = Math.min(14, Math.floor(ageDays / 2));
    points[14 - bucket] += Math.max(4, 8 + (blog.likeCount || 0) * 8 + (blog.commentCount || 0) * 5 + Math.round((blog.content || '').length / 80));
  });
  return points;
}

function MiniSparkline({ points }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const path = points
    .map((point, index) => `${index ? 'L' : 'M'} ${index * 16} ${28 - ((point - min) / Math.max(1, max - min)) * 22}`)
    .join(' ');
  return (
    <svg className="mini-sparkline" viewBox="0 0 112 32" preserveAspectRatio="none" aria-hidden="true">
      <path d={`${path} L 112 32 L 0 32 Z`} className="spark-fill" />
      <path d={path} className="spark-line" />
    </svg>
  );
}

function PerformanceChart({ points }) {
  const max = Math.max(...points);
  const chartPath = points
    .map((point, index) => {
      const x = 16 + index * 22;
      const y = 160 - (point / max) * 132;
      return `${index ? 'L' : 'M'} ${x} ${y}`;
    })
    .join(' ');
  return (
    <div className="performance-chart">
      <div className="chart-gridlines"><span>150</span><span>100</span><span>50</span><span>0</span></div>
      <svg viewBox="0 0 470 190" role="img" aria-label="Content performance over the last 30 days">
        <path d="M16 28H460 M16 72H460 M16 116H460 M16 160H460" className="chart-gridline" />
        <path d={`${chartPath} L 456 160 L 16 160 Z`} className="chart-area" />
        <path d={chartPath} className="chart-line" />
        {points.map((point, index) => <circle key={index} cx={16 + index * 22} cy={160 - (point / max) * 132} r="3" className="chart-dot" />)}
      </svg>
      <div className="chart-labels"><span>Sep 1</span><span>Sep 7</span><span>Sep 14</span><span>Sep 21</span><span>Sep 30</span></div>
    </div>
  );
}

export default function Feed() {
  const { isAuthenticated, username } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState(null);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setBlogs(null);
    setError(null);
    blogApi
      .getAll()
      .then((data) => {
        if (cancelled) return;
        setBlogs([...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const sortedBlogs = blogs || [];
  const featured = sortedBlogs[0];
  const totalComments = sortedBlogs.reduce((sum, blog) => sum + (blog.commentCount || 0), 0);
  const totalLikes = sortedBlogs.reduce((sum, blog) => sum + (blog.likeCount || 0), 0);
  const totalReads = sortedBlogs.reduce((sum, blog) => sum + Math.max(18, (blog.content || '').length * 2), 0);
  const activityPoints = createActivityPoints(sortedBlogs);
  const topPosts = [...sortedBlogs].sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0)).slice(0, 3);
  const recentWriters = [...new Map(sortedBlogs.filter((blog) => blog.username).map((blog) => [blog.username, blog])).values()].slice(0, 4);
  const categories = ['Security', 'Java', 'Spring Boot', 'REST APIs'];

  function handleBack() {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  }

  if (isAuthenticated) {
    return <AuthenticatedFeed blogs={blogs} error={error} username={username} onBack={handleBack} onRetry={() => setReloadKey((key) => key + 1)} />;
  }

  return (
    <div className="dashboard-shell">
      <DashboardSidebar isAuthenticated={isAuthenticated} username={username} onBack={handleBack} />

      <section className="dashboard-content">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">{isAuthenticated ? `Good to see you, ${username}` : 'BackendBytes workspace'}</p>
            <h1>Dashboard</h1>
          </div>
          <Link to="/new" className="btn btn-primary"><PencilIcon /> New post</Link>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
        ) : blogs === null ? (
          <EntrySkeletons count={4} />
        ) : blogs.length === 0 ? (
          <EmptyState title="No entries yet" body="Be the first to write one." action={<Link to="/new" className="btn btn-primary">Write a post</Link>} />
        ) : (
          <>
            <div className="dashboard-stats">
              <div><span className="metric-icon"><PencilIcon /></span><span>Published posts</span><strong>{blogs.length}</strong><MiniSparkline points={activityPoints.slice(0, 8)} /></div>
              <div><span className="metric-icon"><SearchIcon /></span><span>Total reads</span><strong>{totalReads > 999 ? `${(totalReads / 1000).toFixed(1)}K` : totalReads}</strong><MiniSparkline points={activityPoints.slice(2, 10)} /></div>
              <div><span className="metric-icon"><CommentIcon /></span><span>Recent comments</span><strong>{totalComments}</strong><MiniSparkline points={activityPoints.slice(4, 12)} /></div>
              <div><span className="metric-icon"><UserIcon /></span><span>New followers</span><strong>0</strong><MiniSparkline points={activityPoints.slice(5, 13)} /></div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-main-column">
                <section className="performance-panel">
                  <div className="performance-heading"><div><h2>Your content performance</h2><p>Reader activity across the last 30 days</p></div><button className="range-select" type="button">Last 30 days <span>⌄</span></button></div>
                  <PerformanceChart points={activityPoints} />
                </section>
                {featured && (
                  <article className="featured-post">
                    <div className="panel-heading"><span>Featured post</span><Link to={`/blog/${featured.id}`}>Open post</Link></div>
                    <Link to={`/blog/${featured.id}`}>
                      <div className="post-author"><Avatar username={featured.username} profileImage={featured.profileImage} size="sm" /><span>{featured.username || 'unknown'}</span><time>{timeAgo(featured.createdAt)}</time></div>
                      <h2>{featured.title}</h2>
                      <p>{excerpt(featured.content, 210)}</p>
                    </Link>
                    <div className="featured-code">{excerpt(featured.content, 88)}</div>
                    <div className="post-metrics"><span><HeartIcon /> {featured.likeCount || 0} likes</span><span><CommentIcon /> {featured.commentCount || 0} comments</span></div>
                  </article>
                )}
                <div className="panel-heading feed-heading"><span>Latest posts</span><Link to="/search">View all</Link></div>
                <div className="dashboard-post-list">
                  {sortedBlogs.slice(1).map((blog, index) => <EntryCard blog={blog} index={index} key={blog.id} />)}
                </div>
              </div>
              <aside className="dashboard-right-column">
                <div className="dashboard-panel actions-panel"><span className="sidebar-kicker">Actions & top content</span><Link to="/new" className="btn btn-primary btn-block"><PencilIcon /> New post</Link><h3>Your top posts <span>Published</span></h3><div className="top-post-list">{topPosts.map((post) => <Link to={`/blog/${post.id}`} key={post.id}><strong>{post.title}</strong><small><SearchIcon /> {Math.max(18, (post.content || '').length * 2)} reads <CommentIcon /> {post.commentCount || 0}</small></Link>)}</div></div>
                <div className="dashboard-panel">
                  <div className="panel-heading"><span>Top categories</span><span className="panel-muted">This month</span></div>
                  <div className="category-list">{categories.map((category, index) => <div key={category}><span>{category}</span><b>{Math.max(1, sortedBlogs.length - index)}</b></div>)}</div>
                </div>
                <div className="dashboard-panel">
                  <div className="panel-heading"><span>Recent writers</span><Link to="/search">Explore</Link></div>
                  <div className="writer-list">{recentWriters.map((writer) => <Link to={`/profile/${encodeURIComponent(writer.username)}`} key={writer.username}><Avatar username={writer.username} profileImage={writer.profileImage} size="sm" /><span>{writer.username}</span><small>View</small></Link>)}</div>
                </div>
              </aside>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function DashboardSidebar({ isAuthenticated, username, onBack }) {
  return (
    <aside className="dashboard-sidebar">
      <button className="dashboard-back" type="button" onClick={onBack}>&larr; Back</button>
      <div className="sidebar-kicker">Workspace</div>
      <nav className="dashboard-nav">
        <Link className="active" to="/"><HomeIcon /> Dashboard</Link>
        <Link to="/search"><SearchIcon /> Discover</Link>
        <Link to="/new"><PencilIcon /> Write post</Link>
        <Link to={isAuthenticated ? `/profile/${encodeURIComponent(username)}` : '/login'}><UserIcon /> My profile</Link>
        <Link to="/me"><SettingsIcon /> Settings</Link>
      </nav>
      <div className="sidebar-note">
        <strong>Build your archive.</strong>
        <span>Write something worth returning to.</span>
        <Link to="/new" className="btn btn-primary btn-sm">Create post</Link>
      </div>
    </aside>
  );
}

function AuthenticatedFeed({ blogs, error, username, onBack, onRetry }) {
  return (
    <div className="dashboard-shell">
      <DashboardSidebar isAuthenticated username={username} onBack={onBack} />
      <section className="dashboard-content authenticated-feed">
      <div className="wrap">
        <div className="hero compact">
          <h1>Welcome back, {username}.</h1>
          <p className="tag">Here's what people on BackendBytes have been writing.</p>
        </div>
      </div>
      <div className="wrap">
        <div className="feed-tools">
          <span className="section-label">Latest entries</span>
        </div>
        {error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : blogs === null ? (
          <EntrySkeletons count={4} />
        ) : blogs.length === 0 ? (
          <EmptyState title="No entries yet" body="Be the first to write one." action={<Link to="/new" className="btn btn-primary">Write a post</Link>} />
        ) : (
          <div className="entry-list">
            {blogs.map((blog, index) => <EntryCard blog={blog} index={index} key={blog.id} />)}
          </div>
        )}
      </div>
      </section>
    </div>
  );
}
