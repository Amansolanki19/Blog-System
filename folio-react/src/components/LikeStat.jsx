import { HeartIcon } from './Icons';
import { useLikeToggle } from '../hooks/useLikeToggle';

export default function LikeStat({ blogId, initialLiked, initialCount }) {
  const { liked, count, pop, toggle } = useLikeToggle(blogId, initialLiked, initialCount);
  return (
    <button className={`stat-btn ${liked ? 'liked' : ''} ${pop ? 'like-pop' : ''}`} onClick={toggle}>
      <HeartIcon />
      <span>{count}</span>
    </button>
  );
}
