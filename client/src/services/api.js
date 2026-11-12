import { auth } from "../firebase/firebase.config";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const { anonymous = false, ...requestOptions } = options;
  const user = anonymous ? null : auth.currentUser;
  const token = user ? await user.getIdToken() : null;
  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...requestOptions.headers
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

export const sendContact = (payload) =>
  apiRequest("/contact", { method: "POST", body: JSON.stringify(payload) });
