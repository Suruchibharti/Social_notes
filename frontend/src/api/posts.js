import { apiRequest } from "./http";

export function getFeed({ page = 1, limit = 10 } = {}) {
  return apiRequest(`/api/posts/feed?page=${page}&limit=${limit}`);
}

export function getPost(id) {
  return apiRequest(`/api/posts/${id}`);
}

export function createPost(formData) {
  return apiRequest("/api/posts", {
    method: "POST",
    body: formData
  });
}

export function updatePost(id, formData) {
  return apiRequest(`/api/posts/${id}`, {
    method: "PUT",
    body: formData
  });
}

export function deletePost(id) {
  return apiRequest(`/api/posts/${id}`, {
    method: "DELETE"
  });
}
