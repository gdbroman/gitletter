import { GithubIntegration, Newsletter, Subscriber } from "@prisma/client";

import { fetchApi } from "./util";

type NewsletterExtended = Newsletter & {
  subscribers: Subscriber[];
  githubIntegration: GithubIntegration;
};

const getNewsletter = async (newsletterId: string) =>
  fetchApi<NewsletterExtended>(`/newsletter/${newsletterId}`);

const subscribe = async (newsletterId: string, email: string) =>
  fetchApi(`/newsletter/${newsletterId}/subscribe`, "POST", {
    email,
    dontRedirect: true,
  });

export const newsletterService = {
  getNewsletter,
  subscribe,
};
