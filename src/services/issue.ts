import { fetchApi } from "../util/fetchApi";

export const createIssue = async (
  title: string,
  content: string,
  newsletterId: string
) =>
  fetchApi("/issue", "POST", {
    title,
    content,
    newsletterId,
  });

export const updateIssue = async (
  title: string,
  content: string,
  issueId: string
) =>
  fetchApi("/issue", "PUT", {
    title,
    content,
    issueId,
  });

export const deleteIssue = async (issueId: string) =>
  fetchApi("/issue", "DELETE", {
    issueId,
  });

export const sendIssue = async (issueId: string, writeToGithub: boolean) =>
  fetchApi("/issue/send", "POST", {
    issueId,
    writeToGithub,
  });
