import { fetchApi, jsonHeader } from "./util";

const createIssue = async (
  newsletterId: string,
  title: string,
  content: string
) =>
  fetchApi("/issue/create", "POST", {
    title,
    content,
    newsletterId,
  });

const updateIssue = async (issueId: string, title: string, content: string) =>
  fetchApi(
    `/issue/${issueId}`,
    "PUT",
    {
      title,
      content,
    },
    jsonHeader
  );

const deleteIssue = async (issueId: string) =>
  fetchApi(`/issue/${issueId}`, "DELETE");

const sendIssue = async (issueId: string, writeToGithub: boolean) =>
  fetchApi(`/issue/${issueId}/send`, "POST", {
    writeToGithub,
  });

export const issueService = {
  createIssue,
  updateIssue,
  deleteIssue,
  sendIssue,
};
