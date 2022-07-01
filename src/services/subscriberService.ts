import { fetchApi } from "../util/fetchApi";

const createSubscriber = async (email: string, newsletterId: string) =>
  fetchApi(`/subscriber`, "POST", {
    email,
    newsletterId,
  });

const deleteSubscriber = async (subscriberId: string) =>
  fetchApi(`/subscribers/${subscriberId}`, "DELETE");

export const subscriberService = {
  createSubscriber,
  deleteSubscriber,
};
