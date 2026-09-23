import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/endpoints';
import { useToast } from '../context/ToastContext';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get('email') || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authApi.resetPassword({ email: email.trim(), otp: otp.trim(), newPassword });
      toast.success('Password changed — log in with your new password');
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-card">
      <h1>Enter your code</h1>
      <p className="sub">Check your email for a 6-digit code, then set a new password.</p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>6-digit code</label>
          <input
            type="text"
            required
            maxLength={6}
            pattern="\d{6}"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        <div className="field">
          <label>New password</label>
          <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <div className="hint">
            8–20 characters, with upper &amp; lower case, a number, and a symbol (@#$%^&amp;+=!).
          </div>
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? 'Resetting…' : 'Reset password'}
        </button>
      </form>
      <div className="auth-foot">
        <Link to="/login">Back to log in</Link>
      </div>
    </div>
  );
}
