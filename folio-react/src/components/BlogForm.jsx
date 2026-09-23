import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogApi } from '../api/endpoints';
import { useToast } from '../context/ToastContext';

export default function BlogForm({ existing }) {
  const [title, setTitle] = useState(existing?.title || '');
  const [content, setContent] = useState(existing?.content || '');
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const t = title.trim();
    const c = content.trim();
    if (t.length < 3) {
      toast.error('Title needs at least 3 characters');
      return;
    }
    if (!c) {
      toast.error("Content can't be empty");
      return;
    }
    setSaving(true);
    try {
      const blog = existing
        ? await blogApi.update(existing.id, { title: t, content: c })
        : await blogApi.create({ title: t, content: c });
      toast.success(existing ? 'Post updated' : 'Post published');
      navigate(`/blog/${blog.id}`);
    } catch (err) {
      toast.error(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="wrap">
      <div className="hero compact">
        <h1>{existing ? 'Edit post' : 'Write something new'}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Title</label>
          <input
            type="text"
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give it a title"
            required
          />
        </div>
        <div className="field">
          <label>Content</label>
          <textarea
            maxLength={10000}
            style={{ minHeight: 340 }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post…"
            required
          />
          <div className="char-count">{content.length} / 10000</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : existing ? 'Save changes' : 'Publish post'}
          </button>
          <Link className="btn btn-ghost" to={existing ? `/blog/${existing.id}` : '/'}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
