import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const initial = { firstName: '', lastName: '', username: '', email: '', password: '' };

export default function Signup() {
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signup({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password
      });
      toast.success('Account created — log in to continue');
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-card">
      <h1>Join BackendBytes</h1>
      <p className="sub">A few details and you're in.</p>
      <form onSubmit={handleSubmit}>
        <div className="row2">
          <div className="field">
            <label>First name</label>
            <input type="text" required value={form.firstName} onChange={update('firstName')} />
          </div>
          <div className="field">
            <label>Last name</label>
            <input type="text" required value={form.lastName} onChange={update('lastName')} />
          </div>
        </div>
        <div className="field">
          <label>Username</label>
          <input type="text" required autoComplete="username" value={form.username} onChange={update('username')} />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" required autoComplete="email" value={form.email} onChange={update('email')} />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={form.password}
            onChange={update('password')}
          />
          <div className="hint">
            8–20 characters, with upper &amp; lower case, a number, and a symbol (@#$%^&amp;+=!).
          </div>
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <div className="auth-foot">
        Already on BackendBytes? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}
