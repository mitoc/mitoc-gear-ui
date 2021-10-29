type Data = { [key: string]: any };

const API_HOST = "http://127.0.0.1:8000/api/v1";

export async function request(
  path: string,
  method: string,
  data?: Data,
  maxRetry: number = 3
): Promise<any> {
  const response = await fetch(`${API_HOST}${path}`, {
    method: method,
    headers:
      method === "POST"
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
  if (!response.ok) {
    throw Error(await parseResponse(response));
  }
  try {
    return parseResponse(response);
  } catch (e) {
    return;
  }
}

async function parseResponse(response: Response) {
  try {
    return await response.json();
  } catch (e) {
    return;
  }
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
