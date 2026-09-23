import { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { commentApi } from '../api/endpoints';

export default function CommentForm({ blogId, onPosted }) {
  const { isAuthenticated, username, profileImage } = useAuth();
  const toast = useToast();
  const [value, setValue] = useState('');
  const [posting, setPosting] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="empty" style={{ padding: '24px 0' }}>
        <p>
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Log in
          </Link>{' '}
          to join the conversation.
        </p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const content = value.trim();
    if (!content) return;
    setPosting(true);
    try {
      const comment = await commentApi.create(blogId, content);
      setValue('');
      onPosted(comment);
      toast.success('Comment posted');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <Avatar username={username} profileImage={profileImage} />
      <div style={{ flex: 1 }}>
        <textarea
          placeholder="Add a comment…"
          maxLength={2000}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button className="btn btn-primary btn-sm" type="submit" disabled={posting}>
            Post comment
          </button>
        </div>
      </div>
    </form>
  );
}
