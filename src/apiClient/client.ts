import { APIErrorType } from "./types";

type Data = { [key: string]: any };

const API_BASE = process.env.REACT_APP_API_URL || "";

export const API_HOST = API_BASE + "/api/v1";

export async function request(
  path: string,
  method: string,
  data?: Data,
  maxRetry: number = 3,
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
    ...(data != null && method !== "GET" && { body: JSON.stringify(data) }),
  });
  if (response.status === 403) {
    await refreshCsrfToken();
    return request(path, method, data, maxRetry - 1);
  }
  const jsonResponse = await parseJson(response);
  if (!response.ok) {
    if (jsonResponse) {
      throw new APIError(jsonResponse);
    }
    throw new APIError({
      err: "unexpectedServerResponse",
      msg: "Unexpected error response from the server.",
    });
  }
  if (!jsonResponse) {
    return;
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
    return refreshCsrfToken();
  }
  return _csrfToken;
}

export async function refreshCsrfToken() {
  const response = await fetch(`${API_HOST}/auth/csrf/`, {
    credentials: "include",
  });
  const data = await response.json();
  _csrfToken = data.csrfToken;
}

export class APIError extends Error {
  error: APIErrorType;

  constructor(error: APIErrorType) {
    super(JSON.stringify(error));
    this.error = error;
  }
}
