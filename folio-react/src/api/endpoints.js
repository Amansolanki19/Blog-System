import { request } from './client';

/* ---------------------------- Auth ---------------------------- */
export const authApi = {
  signup: (payload) => request('/api/auth/signup', { method: 'POST', auth: false, body: payload }),
  login: (payload) => request('/api/auth/login', { method: 'POST', auth: false, body: payload }),
  forgotPassword: (email) =>
    request('/api/auth/forgot-password', { method: 'POST', auth: false, rawText: true, body: { email } }),
  resetPassword: (payload) =>
    request('/api/auth/reset-password', { method: 'POST', auth: false, rawText: true, body: payload })
};

/* ---------------------------- Blogs ---------------------------- */
export const blogApi = {
  create: (payload) => request('/api/blogs/new', { method: 'POST', body: payload }),
  getAll: () => request('/api/blogs'),
  getById: (id) => request(`/api/blogs/${id}`),
  getMine: () => request('/api/blogs/my'),
  update: (id, payload) => request(`/api/blogs/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => request(`/api/blogs/${id}`, { method: 'DELETE' }),
  getByUsername: (username) => request(`/api/blogs/user/${encodeURIComponent(username)}`),
  search: (keyword) => request(`/api/blogs/search?keyword=${encodeURIComponent(keyword)}`)
};

/* --------------------------- Comments --------------------------- */
export const commentApi = {
  create: (blogId, content) => request(`/api/blogs/${blogId}/comments`, { method: 'POST', body: { content } }),
  getForBlog: (blogId) => request(`/api/blogs/${blogId}/comments`),
  update: (commentId, content) => request(`/api/comments/${commentId}`, { method: 'PUT', body: { content } }),
  remove: (commentId) => request(`/api/comments/${commentId}`, { method: 'DELETE' })
};

/* ---------------------------- Likes ---------------------------- */
export const likeApi = {
  like: (blogId) => request(`/api/blogs/${blogId}/like`, { method: 'POST' }),
  unlike: (blogId) => request(`/api/blogs/${blogId}/unlike`, { method: 'DELETE' }),
  getLikers: (blogId) => request(`/api/blogs/${blogId}/likes`),
  getCount: (blogId) => request(`/api/blogs/${blogId}/likes/count`)
};

/* --------------------------- Follows --------------------------- */
export const followApi = {
  follow: (username) => request(`/api/users/${encodeURIComponent(username)}/follow`, { method: 'POST' }),
  unfollow: (username) => request(`/api/users/${encodeURIComponent(username)}/follow`, { method: 'DELETE' }),
  getFollowers: (username) => request(`/api/users/profile/${encodeURIComponent(username)}/followers`),
  getFollowing: (username) => request(`/api/users/profile/${encodeURIComponent(username)}/following`)
};

/* ---------------------------- Users ---------------------------- */
export const userApi = {
  search: (username) => request(`/api/user/search?username=${encodeURIComponent(username)}`),
  getProfile: (username) => request(`/api/user/${encodeURIComponent(username)}`),
  updateProfile: (payload) => request('/api/user/me', { method: 'PUT', body: payload }),
  changePassword: (payload) => request('/api/user/me/password', { method: 'PUT', body: payload })
};

/* ---------------------------- Admin ---------------------------- */
export const adminApi = {
  getUsers: () => request('/api/admin/users'),
  getUser: (id) => request(`/api/admin/users/${id}`),
  deleteUser: (id) => request(`/api/admin/users/${id}`, { method: 'DELETE' }),
  getBlogs: () => request('/api/admin/blogs'),
  deleteBlog: (id) => request(`/api/admin/blogs/${id}`, { method: 'DELETE' })
};
