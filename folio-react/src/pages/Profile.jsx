import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogApi, followApi, userApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Avatar from '../components/Avatar';
import EntryCard from '../components/EntryCard';
import { CardSkeleton, EmptyState, ErrorState, Spinner } from '../components/States';

export default function Profile() {
  const { username: routeUsername } = useParams();
  const { isAuthenticated, username: myUsername } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('posts');
  const [tabData, setTabData] = useState(null);
  const [tabError, setTabError] = useState(null);
  const [following, setFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setProfile(null);
    setError(null);
    setTab('posts');
    userApi
      .getProfile(routeUsername)
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
        setFollowing(!!data.isFollowing);
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [routeUsername]);

  useEffect(() => {
    if (!profile) return;
    let cancelled = false;
    setTabData(null);
    setTabError(null);
    const loader =
      tab === 'posts'
        ? blogApi.getByUsername(profile.username).then((d) => [...d].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        : tab === 'followers'
        ? followApi.getFollowers(profile.username)
        : followApi.getFollowing(profile.username);
    loader.then((d) => !cancelled && setTabData(d)).catch((e) => !cancelled && setTabError(e.message));
    return () => {
      cancelled = true;
    };
  }, [tab, profile]);

  if (error) {
    return (
      <div className="wrap">
        <ErrorState message={error} />
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="wrap">
        <CardSkeleton />
      </div>
    );
  }

  const isMe = isAuthenticated && myUsername === profile.username;

  async function toggleFollow() {
    setFollowBusy(true);
    try {
      if (following) {
        await followApi.unfollow(profile.username);
        setFollowing(false);
      } else {
        await followApi.follow(profile.username);
        setFollowing(true);
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setFollowBusy(false);
    }
  }

  return (
    <div className="wrap">
      <div className="profile-head">
        <Avatar firstName={profile.firstName} lastName={profile.lastName} username={profile.username} profileImage={profile.profileImage} size="xl" />
        <div style={{ flex: 1 }}>
          <h1>
            {profile.firstName} {profile.lastName}
          </h1>
          <div className="uname">@{profile.username}</div>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          <div className="profile-actions">
            {isMe ? (
              <Link className="btn btn-ghost btn-sm" to="/me">
                Edit profile
              </Link>
            ) : isAuthenticated ? (
              <button
                className="btn btn-primary btn-sm btn-follow"
                data-following={following}
                onClick={toggleFollow}
                disabled={followBusy}
              >
                {following ? 'Unfollow' : 'Follow'}
              </button>
            ) : (
              <Link className="btn btn-primary btn-sm" to="/login">
                Follow
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat">
          <b>{profile.blogCount || 0}</b>
          <span>posts</span>
        </div>
        <button onClick={() => setTab('followers')}>
          <b>{profile.followersCount || 0}</b>
          <span>followers</span>
        </button>
        <button onClick={() => setTab('following')}>
          <b>{profile.followingCount || 0}</b>
          <span>following</span>
        </button>
      </div>

      <div className="tabs">
        <button className={tab === 'posts' ? 'active' : ''} onClick={() => setTab('posts')}>
          Posts
        </button>
        <button className={tab === 'followers' ? 'active' : ''} onClick={() => setTab('followers')}>
          Followers
        </button>
        <button className={tab === 'following' ? 'active' : ''} onClick={() => setTab('following')}>
          Following
        </button>
      </div>

      {tabError ? (
        <ErrorState message={tabError} />
      ) : tabData === null ? (
        <Spinner />
      ) : tab === 'posts' ? (
        tabData.length === 0 ? (
          <EmptyState title="No posts yet" body={`${profile.firstName || profile.username} hasn't published anything.`} />
        ) : (
          <div className="entry-list">
            {tabData.map((b, i) => (
              <EntryCard blog={b} index={i} key={b.id} />
            ))}
          </div>
        )
      ) : tabData.length === 0 ? (
        <EmptyState title="Nobody here yet" body={`No ${tab} to show.`} />
      ) : (
        <div className="people-list">
          {tabData.map((u) => (
            <Link className="person-row" to={`/profile/${encodeURIComponent(u.username)}`} key={u.id}>
              <Avatar firstName={u.firstName} lastName={u.lastName} username={u.username} profileImage={u.profileImage} />
              <div className="who">
                <div className="name">
                  {u.firstName} {u.lastName}
                </div>
                <div className="uname">@{u.username}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
