export const API_URL =  "http://localhost:1337/api"; // process.env.NEXT_PUBLIC_API_URL ||

export async function apiFetch(endpoint, options = {}, token = null) {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    console.error("Response status:", res.status);
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  // Only parse JSON if there is content
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
