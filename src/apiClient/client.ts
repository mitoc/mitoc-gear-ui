type Data = { [key: string]: any };

const API_HOST = "http://127.0.0.1:8000/api/v1";

export async function request(path: string, method: string, data?: Data) {
  const params = {
    method: method,
    headers:
      method === "POST"
        ? {
            "X-CSRFTOKEN": await getCsrfToken(),
            "Content-Type": "application/json",
          }
        : { "Content-Type": "application/json" },
    credentials: "include",
  };
  if (method === "POST") {
    params.body = JSON.stringify(data);
  }
  const response = await fetch(`${API_HOST}${path}`, params);
  console.log(response);
  return await response.json();
}

let _csrfToken: any = null;

async function getCsrfToken() {
  console.log({ _csrfToken });
  if (_csrfToken == null) {
    const response = await fetch(`${API_HOST}/auth/csrf/`, {
      credentials: "include",
    });
    const data = await response.json();
    _csrfToken = data.csrfToken;
  }
  return _csrfToken;
}
