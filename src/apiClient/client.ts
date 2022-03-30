import { ApiError as SerializedApiError } from "./types";

type Data = { [key: string]: any };

const API_HOST = "http://127.0.0.1:8000/api/v1";

export async function request(
  path: string,
  method: string,
  data?: Data,
  maxRetry: number = 3
): Promise<any> {
  if (maxRetry <= 0) {
    return;
  }
  const queryParams =
    data != null && method === "GET" ? "?" + getQueryParams(data) : "";
  const response = await fetch(`${API_HOST}${path}${queryParams}`, {
    method: method,
    headers:
      method !== "GET"
        ? {
            "X-CSRFTOKEN": await getCsrfToken(),
            "Content-Type": "application/json",
          }
        : { "Content-Type": "application/json" },
    credentials: "include",
    ...(data != null && method === "POST" && { body: JSON.stringify(data) }),
  });
  if (response.status === 403) {
    await refreshCsrfToken();
    return request(path, method, data, maxRetry - 1);
  }
  const jsonResponse = await parseJson(response);
  if (!jsonResponse) {
    return;
  }
  if (!response.ok) {
    throw new APIError(jsonResponse);
  }
  return jsonResponse;
}

async function parseJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function getQueryParams(data?: Record<string, any>) {
  return new URLSearchParams(data);
}

let _csrfToken: any = null;

async function getCsrfToken() {
  if (_csrfToken == null) {
    refreshCsrfToken();
  }
  return _csrfToken;
}

async function refreshCsrfToken() {
  const response = await fetch(`${API_HOST}/auth/csrf/`, {
    credentials: "include",
  });
  const data = await response.json();
  _csrfToken = data.csrfToken;
}

export class APIError extends Error {
  error: SerializedApiError;

  constructor(error: SerializedApiError) {
    super(JSON.stringify(error));
    this.error = error;
  }
}
