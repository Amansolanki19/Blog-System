import { storage } from './storage';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Fired whenever a request comes back 401 with a token present, so the
// AuthContext can clear the (now-invalid) session. Set by AuthProvider.
let onUnauthorized = () => {};
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

/**
 * Core request helper.
 * @param {string} path - API path, e.g. '/api/blogs'
 * @param {object} opts
 * @param {'GET'|'POST'|'PUT'|'DELETE'} [opts.method='GET']
 * @param {object} [opts.body] - JSON body, if any
 * @param {boolean} [opts.auth=true] - attach the bearer token when present
 * @param {boolean} [opts.rawText=false] - resolve with plain text instead of parsed JSON
 */
export async function request(path, { method = 'GET', body, auth = true, rawText = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth && storage.token) headers['Authorization'] = 'Bearer ' + storage.token;

  let res;
  try {
    res = await fetch(storage.apiBase.replace(/\/$/, '') + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch (e) {
    throw new ApiError(
      `Can't reach the API at ${storage.apiBase}. Is the backend running? (Settings → API address)`,
      0
    );
  }

  if (res.status === 204) return null;

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    if (res.status === 401 && storage.token) onUnauthorized();
    const message =
      (data && typeof data === 'object' && data.message) ||
      (typeof data === 'string' && data) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return rawText ? text : data;
}
