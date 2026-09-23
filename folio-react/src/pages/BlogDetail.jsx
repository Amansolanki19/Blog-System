import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { blogApi, commentApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { useConfirm } from '../context/ConfirmContext';
import { useToast } from '../context/ToastContext';
import Avatar from '../components/Avatar';
import LikePill from '../components/LikePill';
import CommentForm from '../components/CommentForm';
import CommentItem from '../components/CommentItem';
import { CardSkeleton, ErrorState, Spinner } from '../components/States';
import { CommentIcon, PencilIcon, TrashIcon } from '../components/Icons';
import { paragraphs, readTime, timeAgo } from '../utils/format';

export default function BlogDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { username } = useAuth();
  const confirm = useConfirm();
  const toast = useToast();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState(null);
  const [commentsError, setCommentsError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setBlog(null);
    setError(null);
    setComments(null);
    blogApi
      .getById(id)
      .then((data) => !cancelled && setBlog(data))
      .catch((e) => !cancelled && setError(e.message));
    commentApi
      .getForBlog(id)
      .then((data) => !cancelled && setComments([...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .catch((e) => !cancelled && setCommentsError(e.message));
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (location.hash !== '#comments' || !comments) return;
    requestAnimationFrame(() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' }));
  }, [location.hash, comments]);

  if (error) {
    return (
      <div className="wrap">
        <ErrorState message={error} />
      </div>
    );
  }
  if (!blog) {
    return (
      <div className="wrap">
        <CardSkeleton />
      </div>
    );
  }

  const isOwner = username === blog.username;

  async function handleDeletePost() {
    const ok = await confirm({
      title: 'Delete this post?',
      body: "This can't be undone. Comments and likes on it will be removed too.",
      confirmText: 'Delete',
      danger: true
    });
    if (!ok) return;
    try {
      await blogApi.remove(blog.id);
      toast.success('Post deleted');
      navigate('/');
    } catch (e) {
      toast.error(e.message);
    }
  }

  function handleCommentPosted(comment) {
    setComments((list) => [comment, ...(list || [])]);
    setBlog((b) => ({ ...b, commentCount: (b.commentCount || 0) + 1 }));
  }
  function handleCommentDeleted(commentId) {
    setComments((list) => list.filter((c) => c.id !== commentId));
    setBlog((b) => ({ ...b, commentCount: Math.max(0, (b.commentCount || 0) - 1) }));
  }
  function handleCommentUpdated(updated) {
    setComments((list) => list.map((c) => (c.id === updated.id ? updated : c)));
  }

  return (
    <div className="wrap">
      <div className="post-head">
        <Link to="/" className="section-label">
          &larr; Back to feed
        </Link>
        <h1 style={{ marginTop: 14 }}>{blog.title}</h1>
        <div className="post-byline">
          <Link to={`/profile/${encodeURIComponent(blog.username)}`}>
            <Avatar username={blog.username} profileImage={blog.profileImage} />
          </Link>
          <div className="who">
            <Link to={`/profile/${encodeURIComponent(blog.username)}`} className="name">
              {blog.username}
            </Link>
            <div className="meta">
              {timeAgo(blog.createdAt)} · {readTime(blog.content)} min read
              {blog.updatedAt && blog.updatedAt !== blog.createdAt ? ' · edited' : ''}
            </div>
          </div>
          {isOwner && (
            <div className="post-owner-actions">
              <Link className="icon-btn" to={`/edit/${blog.id}`} title="Edit">
                <PencilIcon />
              </Link>
              <button className="icon-btn" title="Delete" onClick={handleDeletePost}>
                <TrashIcon />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="post-body">
        {paragraphs(blog.content).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="post-actions">
        <LikePill blogId={blog.id} initialLiked={blog.likedByCurrentUser} initialCount={blog.likeCount} />
        <span className="pill-btn" style={{ cursor: 'default' }}>
          <CommentIcon />
          <span>{blog.commentCount || 0}</span> comments
        </span>
      </div>

      <div className="comments" id="comments">
        <h3>Comments</h3>
        <CommentForm blogId={blog.id} onPosted={handleCommentPosted} />
        {commentsError ? (
          <ErrorState message={commentsError} />
        ) : comments === null ? (
          <Spinner />
        ) : comments.length === 0 ? (
          <div className="empty" style={{ padding: '30px 0' }}>
            <p>No comments yet — say something first.</p>
          </div>
        ) : (
          comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              onDeleted={handleCommentDeleted}
              onUpdated={handleCommentUpdated}
            />
          ))
        )}
      </div>
    </div>
  );
}
