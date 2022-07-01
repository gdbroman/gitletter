export const fetchApi = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH" = "GET",
  body?: any
): Promise<T> => {
  const response = await fetch(`${process.env.APP_URL}/api${endpoint}`, {
    headers:
      method === "POST"
        ? {
            "Content-Type": "application/json",
          }
        : undefined,
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
