import { GithubIntegration, Newsletter, Subscriber } from "@prisma/client";

import { fetchApi } from "./util";

type NewsletterExtended = Newsletter & {
  subscribers: Subscriber[];
  githubIntegration: GithubIntegration;
};

const getNewsletterByEmail = async (email: string) =>
  fetchApi<string>(`/newsletter/email/${email}`, "GET");

const updateNewsletter = async (newsletterId: string, title: string) =>
  fetchApi<NewsletterExtended>(`/newsletter/${newsletterId}`, "PUT", { title });

const subscribe = async (newsletterId: string, email: string) =>
  fetchApi(`/newsletter/${newsletterId}/subscribe`, "POST", {
    email,
    dontRedirect: true,
  });

export const newsletterService = {
  getNewsletterByEmail,
  updateNewsletter,
  subscribe,
};
