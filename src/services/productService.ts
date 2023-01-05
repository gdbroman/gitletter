import { fetchApi } from "./util";

const createSession = async (priceId: string): Promise<string | null> =>
  fetchApi(`/product/${priceId}`, "GET");

export const productService = {
  createSession,
};
