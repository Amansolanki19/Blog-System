import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { EyeIcon, EyeOffIcon } from '../components/Icons';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await login(username.trim(), password);
      toast.success('Welcome back, ' + res.username);
      const dest = location.state?.from?.pathname || '/';
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-card">
      <h1>Welcome back</h1>
      <p className="sub">Log in to write, like, and follow.</p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Username or email</label>
          <input
            type="text"
            required
            autoComplete="username"
            placeholder="Username or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Password</label>
          <div className="password-input-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="password-toggle"
              type="button"
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <div className="auth-foot">
        <Link to="/forgot-password">Forgot your password?</Link>
      </div>
      <div className="auth-foot">
        New to BackendBytes? <Link to="/signup">Create an account</Link>
      </div>
    </div>
  );
}
