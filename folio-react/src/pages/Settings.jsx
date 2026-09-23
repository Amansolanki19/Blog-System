import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CardSkeleton, ErrorState } from '../components/States';
import Avatar from '../components/Avatar';

export default function Settings() {
  const { username, logout, updateProfileImage } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', bio: '', profileImage: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;
    userApi
      .getProfile(username)
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          bio: data.bio || '',
          profileImage: data.profileImage || ''
        });
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [username]);

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await userApi.updateProfile({
        firstName: form.firstName.trim() || undefined,
        lastName: form.lastName.trim() || undefined,
        bio: form.bio.trim(),
        profileImage: form.profileImage.trim()
      });
      updateProfileImage(form.profileImage.trim());
      toast.success('Profile saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await userApi.changePassword({ oldPassword, newPassword });
      toast.success('Password updated');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingPassword(false);
    }
  }

  function handleSignOut() {
    logout();
    toast('Signed out');
    navigate('/');
  }

  if (error) {
    return (
      <div className="wrap-wide">
        <ErrorState message={error} />
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="wrap-wide">
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="wrap-wide">
      <div className="hero compact">
        <h1>Settings</h1>
        <p className="tag">Manage your BackendBytes profile and account.</p>
      </div>
      <div className="row2" style={{ alignItems: 'start' }}>
        <div className="card">
          <h3 style={{ marginBottom: 18 }}>Profile</h3>
          <Avatar firstName={form.firstName} lastName={form.lastName} username={username} profileImage={form.profileImage} size="lg" />
          <form onSubmit={handleProfileSubmit}>
            <div className="row2">
              <div className="field">
                <label>First name</label>
                <input
                  type="text"
                  maxLength={20}
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Last name</label>
                <input
                  type="text"
                  maxLength={20}
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="field">
              <label>Bio</label>
              <textarea
                maxLength={500}
                style={{ minHeight: 90 }}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Profile image URL</label>
              <input
                type="text"
                value={form.profileImage}
                onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
                placeholder="https://…"
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={savingProfile}>
              {savingProfile ? 'Saving…' : 'Save profile'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 18 }}>Change password</h3>
          <form onSubmit={handlePasswordSubmit}>
            <div className="field">
              <label>Current password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="field">
              <label>New password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="hint">
                8–20 characters, with upper &amp; lower case, a number, and a symbol (@#$%^&amp;+=!).
              </div>
            </div>
            <button className="btn btn-ghost" type="submit" disabled={savingPassword}>
              {savingPassword ? 'Updating…' : 'Update password'}
            </button>
          </form>
          <div className="divider-label">danger zone</div>
          <p className="hint" style={{ marginBottom: 10 }}>
            Signing out clears this device only.
          </p>
          <button className="btn btn-danger btn-sm" onClick={handleSignOut}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
