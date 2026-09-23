import { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { timeAgo } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import { useConfirm } from '../context/ConfirmContext';
import { useToast } from '../context/ToastContext';
import { commentApi } from '../api/endpoints';

export default function CommentItem({ comment, onDeleted, onUpdated }) {
  const { username } = useAuth();
  const confirm = useConfirm();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [saving, setSaving] = useState(false);
  const mine = username === comment.username;

  async function handleDelete() {
    const ok = await confirm({
      title: 'Delete comment?',
      body: "This can't be undone.",
      confirmText: 'Delete',
      danger: true
    });
    if (!ok) return;
    try {
      await commentApi.remove(comment.id);
      onDeleted(comment.id);
      toast.success('Comment deleted');
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function handleSave() {
    const val = draft.trim();
    if (!val) return;
    setSaving(true);
    try {
      const updated = await commentApi.update(comment.id, val);
      onUpdated(updated);
      setEditing(false);
      toast.success('Comment updated');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="comment">
      <Link to={`/profile/${encodeURIComponent(comment.username)}`}>
        <Avatar firstName={comment.firstName} lastName={comment.lastName} username={comment.username} profileImage={comment.profileImage} />
      </Link>
      <div style={{ flex: 1 }}>
        <div>
          <Link to={`/profile/${encodeURIComponent(comment.username)}`} className="name">
            {comment.firstName || comment.username} {comment.lastName || ''}
          </Link>
          <span className="time">{timeAgo(comment.createdAt)}</span>
        </div>
        {editing ? (
          <div>
            <textarea
              style={{ minHeight: 50 }}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={2000}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                Save
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(false); setDraft(comment.content); }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="body">{comment.content}</div>
            {mine && (
              <div className="comment-actions">
                <button onClick={() => setEditing(true)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
