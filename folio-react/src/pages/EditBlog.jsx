import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BlogForm from '../components/BlogForm';
import { CardSkeleton, ErrorState } from '../components/States';

export default function EditBlog() {
  const { id } = useParams();
  const { username } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    blogApi
      .getById(id)
      .then((data) => {
        if (cancelled) return;
        if (data.username !== username) {
          toast.error('You can only edit your own posts');
          navigate(`/blog/${id}`);
          return;
        }
        setBlog(data);
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
  return <BlogForm existing={blog} />;
}
