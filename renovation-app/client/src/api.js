// client/src/api.js
// All server communication lives here.
// If you ever move to a different backend, only this file changes.

const BASE = "/api";

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    // Session expired — reload to trigger login redirect
    window.location.reload();
    return;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }

  return res.json();
}

export const api = {
  auth: {
    me:     ()         => request("GET",  "/auth/me"),
    login:  (password) => request("POST", "/auth/login",  { password }),
    logout: ()         => request("POST", "/auth/logout"),
  },
  properties: {
    list:   ()         => request("GET",  "/properties"),
    get:    (id)       => request("GET",  `/properties/${id}`),
    create: (data)     => request("POST", "/properties", data),
    update: (id, data) => request("PUT",  `/properties/${id}`, data),
    delete: (id)       => request("DELETE", `/properties/${id}`),
  },
};
