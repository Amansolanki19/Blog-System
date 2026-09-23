import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { likeApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function useLikeToggle(blogId, initialLiked, initialCount) {
  const [liked, setLiked] = useState(!!initialLiked);
  const [count, setCount] = useState(initialCount || 0);
  const [pop, setPop] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  async function toggle(e) {
    if (e) e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Sign in to continue');
      navigate('/login');
      return;
    }
    const next = !liked;
    setLiked(next);
    setCount((c) => Math.max(0, c + (next ? 1 : -1)));
    setPop(true);
    setTimeout(() => setPop(false), 400);
    try {
      if (next) await likeApi.like(blogId);
      else await likeApi.unlike(blogId);
    } catch (err) {
      // roll back on failure
      setLiked(!next);
      setCount((c) => Math.max(0, c + (next ? -1 : 1)));
      toast.error(err.message);
    }
  }

  return { liked, count, pop, toggle };
}
