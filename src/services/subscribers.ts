export const addSubscriber = async (email: string, newsletterId: string) => {
  return fetch(`${process.env.APP_URL}/api/${newsletterId}/subscribers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
    }),
  });
};

export const removeSubscriber = async (email: string, newsletterId: string) => {
  return fetch(`${process.env.APP_URL}/api/${newsletterId}/subscribers`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
    }),
  });
};
