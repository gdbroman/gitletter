import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing Stripe secret key");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

export type Product = {
  id: string;
  name: string;
  price: number;
  priceId: string;
  interval: Stripe.Price.Recurring.Interval;
  currency: string;
};

export const getProducts = async (): Promise<Product[]> => {
  const { data: prices } = await stripe.prices.list();

  const productPromises = prices.map(async (price) => {
    const product = await stripe.products.retrieve(price.product as string);

    return {
      id: product.id,
      name: product.name,
      price: price.unit_amount ?? 0,
      priceId: price.id,
      interval: price.recurring?.interval ?? "month",
      currency: price.currency,
    };
  });

  return await (
    await Promise.all(productPromises)
  ).sort((a, b) => a.price - b.price);
};

export const getFreeProductId = async (): Promise<string> => {
  const products = await getProducts();
  const freeProduct = products.find((product) => product.price === 0);

  if (!freeProduct) {
    throw new Error("No free product found");
  }

  return freeProduct.id;
};
