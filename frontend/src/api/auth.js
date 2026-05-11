import { apiRequest, tokenStore } from "./http";

export async function loginUser(payload) {
  const data = await apiRequest("/api/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  tokenStore.set(data.token);
  return data;
}

export async function registerUser(formData) {
  return apiRequest("/api/register", {
    method: "POST",
    body: formData
  });
}

export async function getCurrentProfile() {
  return apiRequest("/api/profile");
}

export async function updateCurrentProfile(formData) {
  return apiRequest("/api/profile", {
    method: "PUT",
    body: formData
  });
}
