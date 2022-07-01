export const jsonHeader = { "Content-Type": "application/json" };

export const fetchApi = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH" = "GET",
  body?: any,
  headers?: any
): Promise<T> => {
  const response = await fetch(`${process.env.APP_URL}/api${endpoint}`, {
    headers: ["POST"].includes(method) ? jsonHeader : headers ?? undefined,
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
