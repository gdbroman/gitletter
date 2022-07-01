import { fetchApi } from "../util/fetchApi";

const getSubscriberCount = async (
  newsletterId: string
): Promise<number | null> =>
  fetchApi(`/newsletter/${newsletterId}/subscriber-count`);

export const newsletterService = {
  getSubscriberCount,
};
