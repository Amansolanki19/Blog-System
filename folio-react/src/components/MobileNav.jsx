import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HomeIcon, SearchIcon, PlusIcon, UserIcon } from './Icons';

export default function MobileNav() {
  const { isAuthenticated, username } = useAuth();
  return (
    <nav className="mobile-nav">
      <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
        <HomeIcon /> Feed
      </NavLink>
      <NavLink to="/search" className={({ isActive }) => (isActive ? 'active' : '')}>
        <SearchIcon /> Search
      </NavLink>
      <NavLink to="/new" className={({ isActive }) => (isActive ? 'active' : '')}>
        <PlusIcon /> Write
      </NavLink>
      <NavLink
        to={isAuthenticated ? `/profile/${encodeURIComponent(username)}` : '/login'}
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        <UserIcon /> You
      </NavLink>
    </nav>
  );
}
