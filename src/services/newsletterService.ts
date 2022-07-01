import { GithubIntegration, Newsletter, Subscriber } from "@prisma/client";

import { fetchApi } from "./util";

type NewsletterExtended = Newsletter & {
  subscribers: Subscriber[];
  githubIntegration: GithubIntegration;
};

const getNewsletter = async (newsletterId: string) =>
  fetchApi<NewsletterExtended>(`/newsletter/${newsletterId}`);

export const newsletterService = {
  getNewsletter,
};
