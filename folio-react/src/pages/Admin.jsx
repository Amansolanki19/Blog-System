import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/endpoints';
import { useConfirm } from '../context/ConfirmContext';
import { useToast } from '../context/ToastContext';
import Avatar from '../components/Avatar';
import { ErrorState, Spinner } from '../components/States';
import { excerpt, timeAgo } from '../utils/format';

export default function Admin() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [error, setError] = useState(null);
  const confirm = useConfirm();
  const toast = useToast();

  useEffect(() => {
    setError(null);
    if (tab === 'users' && users === null) {
      adminApi.getUsers().then(setUsers).catch((e) => setError(e.message));
    }
    if (tab === 'blogs' && blogs === null) {
      adminApi.getBlogs().then(setBlogs).catch((e) => setError(e.message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function handleDeleteUser(id) {
    const ok = await confirm({
      title: 'Delete this user?',
      body: "Their posts, comments and likes will be removed too. This can't be undone.",
      confirmText: 'Delete user',
      danger: true
    });
    if (!ok) return;
    try {
      await adminApi.deleteUser(id);
      setUsers((list) => list.filter((u) => u.id !== id));
      toast.success('User deleted');
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function handleDeleteBlog(id) {
    const ok = await confirm({
      title: 'Delete this post?',
      body: "This can't be undone.",
      confirmText: 'Delete post',
      danger: true
    });
    if (!ok) return;
    try {
      await adminApi.deleteBlog(id);
      setBlogs((list) => list.filter((b) => b.id !== id));
      toast.success('Post deleted');
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="wrap-wide">
      <div className="hero compact">
        <h1>Admin panel</h1>
        <p className="tag">Manage every user and post on BackendBytes.</p>
      </div>
      <div className="admin-tabs">
        <button className={`btn btn-sm ${tab === 'users' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('users')}>
          Users
        </button>
        <button className={`btn btn-sm ${tab === 'blogs' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('blogs')}>
          Posts
        </button>
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : tab === 'users' ? (
        users === null ? (
          <Spinner />
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Username</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar firstName={u.firstName} lastName={u.lastName} username={u.username} profileImage={u.profileImage} />
                      <Link to={`/profile/${encodeURIComponent(u.username)}`}>
                        {u.firstName} {u.lastName}
                      </Link>
                    </div>
                  </td>
                  <td>@{u.username}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : blogs === null ? (
        <Spinner />
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Published</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((b) => (
              <tr key={b.id}>
                <td>
                  <Link to={`/blog/${b.id}`}>{excerpt(b.title, 50)}</Link>
                </td>
                <td>
                  <Link to={`/profile/${encodeURIComponent(b.username)}`}>@{b.username}</Link>
                </td>
                <td>{timeAgo(b.createdAt)}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBlog(b.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
