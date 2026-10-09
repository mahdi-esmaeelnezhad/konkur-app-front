const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("konkur_access");
}

export function setTokens(access: string, refresh?: string) {
  localStorage.setItem("konkur_access", access);
  if (refresh) localStorage.setItem("konkur_refresh", refresh);
}

export function clearTokens() {
  localStorage.removeItem("konkur_access");
  localStorage.removeItem("konkur_refresh");
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const finalHeaders = new Headers(headers || {});
  if (!finalHeaders.has("Content-Type") && rest.body) {
    finalHeaders.set("Content-Type", "application/json");
  }
  if (auth) {
    const token = getToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      (data as { error?: { message?: string }; detail?: string })?.error?.message ||
      (data as { detail?: string })?.detail ||
      `Request failed (${res.status})`;
    throw new ApiError(res.status, String(msg), data);
  }

  if (data && typeof data === "object" && "success" in data && "data" in data) {
    return (data as unknown as { data: T }).data;
  }
  return data as T;
}
