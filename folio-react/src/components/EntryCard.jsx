import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import LikeStat from './LikeStat';
import { CommentIcon } from './Icons';
import { excerpt, readTime, timeAgo } from '../utils/format';

export default function EntryCard({ blog, index = 0 }) {
  const author = blog.username || 'unknown';
  return (
    <div className="entry" style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}>
      <Link to={`/blog/${blog.id}`} style={{ display: 'block' }}>
        <div className="entry-meta">
          <Avatar username={author} profileImage={blog.profileImage} size="sm" />
          <span className="name">{author}</span>
          <span className="dot">·</span>
          <span className="date">{timeAgo(blog.createdAt)}</span>
          <span className="dot">·</span>
          <span className="read-min">{readTime(blog.content)} min read</span>
        </div>
        <h2>{blog.title}</h2>
        <p className="excerpt">{excerpt(blog.content, 220)}</p>
      </Link>
      <div className="entry-foot">
        <LikeStat blogId={blog.id} initialLiked={blog.likedByCurrentUser} initialCount={blog.likeCount} />
        <Link
          className="stat-btn comment-stat"
          to={`/blog/${blog.id}#comments`}
          aria-label={`Read ${blog.commentCount || 0} comments`}
        >
          <CommentIcon />
          <span>{blog.commentCount || 0}</span>
        </Link>
      </div>
    </div>
  );
}
