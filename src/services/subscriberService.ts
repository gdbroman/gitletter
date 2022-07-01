import { fetchApi } from "./util";

const deleteSubscriber = async (subscriberId: string) =>
  fetchApi(`/subscriber/${subscriberId}`, "DELETE");

export const subscriberService = {
  deleteSubscriber,
};
