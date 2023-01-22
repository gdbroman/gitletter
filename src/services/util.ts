const jsonHeader = { "Content-Type": "application/json" };

export const fetchApi = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH" = "GET",
  body?: Record<string, unknown>,
  headers?: Headers
): Promise<T | null> => {
  const response = await fetch(`${process.env.APP_URL}/api${endpoint}`, {
    headers: ["POST", "PUT"].includes(method) ? jsonHeader : headers,
    method,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.ok) {
    return response.json();
  } else {
    console.error(response.statusText);
    return null;
  }
};
