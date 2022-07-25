import { fetchApi } from "./util";

const createIssue = async (
  newsletterId: string,
  fileName: string,
  content: string
) =>
  fetchApi("/issue/create", "POST", {
    fileName,
    content,
    newsletterId,
  });

const updateIssue = async (
  issueId: string,
  fileName: string,
  content: string
) =>
  fetchApi(`/issue/${issueId}`, "PUT", {
    fileName,
    content,
  });

const deleteIssue = async (issueId: string) =>
  fetchApi(`/issue/${issueId}`, "DELETE");

const sendIssue = async (issueId: string, writeToGithub: boolean) =>
  fetchApi(`/issue/${issueId}/send`, "POST", {
    writeToGithub,
  });

const sendTestEmail = async (issueId: string, email: string) =>
  fetchApi(`/issue/${issueId}/send-test/${email}`, "POST");

export const issueService = {
  createIssue,
  updateIssue,
  deleteIssue,
  sendIssue,
  sendTestEmail,
};
