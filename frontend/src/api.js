const API_BASE = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "skillbridge_token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export function clearToken() {
  setToken("");
}

function authHeaders(extra = {}) {
  const headers = { ...extra };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = authHeaders(
    isFormData ? options.headers : { "Content-Type": "application/json", ...options.headers }
  );

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  getMe: () => request("/auth/me"),

  getPosts: (params = "") => request(`/posts${params}`),
  getPost: (id) => request(`/posts/${id}`),
  createPost: (body) => request("/posts", { method: "POST", body: JSON.stringify(body) }),
  deletePost: (id) => request(`/posts/${id}`, { method: "DELETE" }),
  addAnswer: (postId, formData) =>
    request(`/posts/${postId}/answers`, { method: "POST", body: formData }),
  upvoteAnswer: (postId, answerId) =>
    request(`/posts/${postId}/answers/${answerId}/upvote`, { method: "PATCH" }),
  markBestAnswer: (postId, answerId) =>
    request(`/posts/${postId}/answers/${answerId}/best`, { method: "PATCH" }),

  getLeaderboard: () => request("/users/leaderboard"),
  getUser: (name) => request(`/users/${encodeURIComponent(name)}`),
  updateUser: (id, body) =>
    request(`/users/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteUser: (id) => request(`/users/${id}`, { method: "DELETE" }),
};

export function imageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return path;
}
