export const createIssue = async (
  title: string,
  content: string,
  newsletterId: string
) => {
  return fetch(`${process.env.APP_URL}/api/issue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      content,
      newsletterId,
    }),
  });
};

export const updateIssue = async (
  title: string,
  content: string,
  issueId: string
) => {
  return fetch(`${process.env.APP_URL}/api/issue`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      content,
      issueId,
    }),
  });
};

export const sendIssue = async (issueId: string) => {
  return fetch(`${process.env.APP_URL}/api/issue/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      issueId,
    }),
  });
};

export const deleteIssue = async (issueId: string) => {
  return fetch(`${process.env.APP_URL}/api/issue`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      issueId,
    }),
  });
};
