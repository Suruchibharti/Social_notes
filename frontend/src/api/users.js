import { apiRequest } from "./http";

export function getUsers({ search = "", page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (search.trim()) params.set("search", search.trim());
  return apiRequest(`/api/users?${params.toString()}`);
}

export function getUserById(id) {
  return apiRequest(`/api/users/${id}`);
}

export function followUser(id) {
  return apiRequest(`/api/follow/${id}`, { method: "POST" });
}

export function unfollowUser(id) {
  return apiRequest(`/api/follow/${id}`, { method: "DELETE" });
}

export function getFollowing() {
  return apiRequest("/api/following");
}

export function getFollowers(id) {
  return apiRequest(`/api/followers/${id}`);
}
