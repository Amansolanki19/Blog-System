import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import {
  SunIcon,
  MoonIcon,
  SearchIcon,
  UserIcon,
  SettingsIcon,
  ShieldIcon,
  LogoutIcon
} from './Icons';

export default function Navbar() {
  const { isAuthenticated, isAdmin, username, profileImage, logout } = useAuth();
  const { toggle: toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  function handleSearchKey(e) {
    if (e.key === 'Enter' && search.trim()) {
      navigate('/search?q=' + encodeURIComponent(search.trim()));
    }
  }

  function handleLogout() {
    logout();
    toast('Signed out');
    navigate('/');
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <NavLink to="/" className="brand">
          Backend<span>Bytes</span>
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Feed
          </NavLink>
          <NavLink to="/new" className={({ isActive }) => (isActive ? 'active' : '')}>
            Write
          </NavLink>
        </nav>
        <div className="search-mini">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search posts or writers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKey}
          />
        </div>
        <div className="top-actions">
          <button className="icon-btn theme-toggle" title="Toggle theme" onClick={toggleTheme}>
            <SunIcon />
            <MoonIcon />
          </button>
          {isAuthenticated ? (
            <div className="menu-wrap" ref={menuRef}>
              <button className="avatar" title={username} onClick={() => setMenuOpen((o) => !o)}>
                {profileImage && <img src={profileImage} alt="" onError={(event) => event.currentTarget.remove()} />}
                {(username || '?').slice(0, 2).toUpperCase()}
              </button>
              <div className={`menu ${menuOpen ? 'open' : ''}`}>
                <NavLink to={`/profile/${encodeURIComponent(username)}`} onClick={() => setMenuOpen(false)}>
                  <UserIcon /> Your profile
                </NavLink>
                <NavLink to="/me" onClick={() => setMenuOpen(false)}>
                  <SettingsIcon /> Settings
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" onClick={() => setMenuOpen(false)}>
                    <ShieldIcon /> Admin panel
                  </NavLink>
                )}
                <hr />
                <button onClick={handleLogout}>
                  <LogoutIcon /> Log out
                </button>
              </div>
            </div>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost btn-sm">
                Log in
              </NavLink>
              <NavLink to="/signup" className="btn btn-primary btn-sm">
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

