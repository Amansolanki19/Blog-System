const KEYS = {
  token: 'folio_token',
  username: 'folio_username',
  profileImage: 'folio_profile_image',
  role: 'folio_role',
  theme: 'folio_theme',
  apiBase: 'folio_api_base'
};

const DEFAULT_API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1912';

function get(key) {
  return localStorage.getItem(key);
}
function set(key, value) {
  if (value === null || value === undefined) localStorage.removeItem(key);
  else localStorage.setItem(key, value);
}

export const storage = {
  get token() { return get(KEYS.token); },
  set token(v) { set(KEYS.token, v); },

  get username() { return get(KEYS.username); },
  set username(v) { set(KEYS.username, v); },

  get profileImage() { return get(KEYS.profileImage); },
  set profileImage(v) { set(KEYS.profileImage, v); },

  get role() { return get(KEYS.role); },
  set role(v) { set(KEYS.role, v); },

  get theme() { return get(KEYS.theme); },
  set theme(v) { set(KEYS.theme, v); },

  get apiBase() { return get(KEYS.apiBase) || DEFAULT_API_BASE; },
  set apiBase(v) { set(KEYS.apiBase, v); },

  clearSession() {
    set(KEYS.token, null);
    set(KEYS.username, null);
    set(KEYS.profileImage, null);
    set(KEYS.role, null);
  }
};
