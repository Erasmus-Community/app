function csrfToken(): string | undefined {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
    ?.content;
}

async function request<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": csrfToken() ?? "",
    },
    credentials: "same-origin",
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(
      data.error ||
        (data.errors || []).join(", ") ||
        `Request failed (${res.status})`,
    ) as Error & { status: number; data: unknown };
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data as T;
}

export const apiClient = {
  get: <T = unknown>(path: string) => request<T>("GET", path),
  post: <T = unknown>(path: string, body?: unknown) =>
    request<T>("POST", path, body),
  patch: <T = unknown>(path: string, body?: unknown) =>
    request<T>("PATCH", path, body),
  delete: <T = unknown>(path: string) => request<T>("DELETE", path),
};
