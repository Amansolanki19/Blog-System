import { HeartIcon } from './Icons';
import { useLikeToggle } from '../hooks/useLikeToggle';

export default function LikePill({ blogId, initialLiked, initialCount }) {
  const { liked, count, pop, toggle } = useLikeToggle(blogId, initialLiked, initialCount);
  return (
    <button className={`pill-btn ${liked ? 'liked' : ''}`} onClick={toggle}>
      <HeartIcon style={pop ? { animation: 'heartPop .4s ease' } : undefined} />
      <span>{count}</span> {count === 1 ? 'like' : 'likes'}
    </button>
  );
}
