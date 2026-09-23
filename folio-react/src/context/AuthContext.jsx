import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { storage } from '../api/storage';
import { authApi } from '../api/endpoints';
import { setUnauthorizedHandler } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => ({
    token: storage.token,
    username: storage.username,
    profileImage: storage.profileImage,
    role: storage.role
  }));

  const clear = useCallback(() => {
    storage.clearSession();
    setSession({ token: null, username: null, profileImage: null, role: null });
  }, []);

  // If any request comes back 401, drop the (stale/expired) session.
  useMemo(() => setUnauthorizedHandler(clear), [clear]);

  const login = useCallback(async (username, password) => {
    const res = await authApi.login({ username, password });
    storage.token = res.token;
    storage.username = res.username;
    storage.profileImage = res.profileImage;
    storage.role = res.role || 'USER';
    setSession({ token: res.token, username: res.username, profileImage: res.profileImage, role: res.role || 'USER' });
    return res;
  }, []);

  const signup = useCallback((payload) => authApi.signup(payload), []);

  const logout = useCallback(() => clear(), [clear]);
  const updateProfileImage = useCallback((profileImage) => {
    storage.profileImage = profileImage;
    setSession((current) => ({ ...current, profileImage }));
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: !!session.token,
      isAdmin: session.role === 'ADMIN',
      username: session.username,
      profileImage: session.profileImage,
      role: session.role,
      login,
      signup,
      logout,
      updateProfileImage
    }),
    [session, login, signup, logout, updateProfileImage]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
