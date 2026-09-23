import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/endpoints';
import { useToast } from '../context/ToastContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authApi.forgotPassword(email.trim());
      toast.success('Check your inbox for a code');
      navigate('/reset-password?email=' + encodeURIComponent(email.trim()));
    } catch (err) {
      toast.error(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-card">
      <h1>Reset your password</h1>
      <p className="sub">We'll email a one-time code to your inbox.</p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send code'}
        </button>
      </form>
      <div className="auth-foot">
        Have a code already? <Link to="/reset-password">Enter it here</Link>
      </div>
    </div>
  );
}
