import type { NextApiRequest, NextApiResponse } from "next";

import { populateIntroIssue } from "../../prisma/modules/issue";
import { getFreeProductId, stripe } from "../../prisma/modules/stripe";
import prisma from "../../prisma/prisma";
import { getAppBasePath } from "../../util/hooks/useAppHref";
import { unstableGetServerSession } from "./auth/getServerSession";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstableGetServerSession(req, res);
  if (!session || !session.user?.email)
    return res.status(401).json({ message: "Unauthorized" });

  const userEmail = session.user.email;
  const existingNewsletter = await prisma.newsletter.findFirst({
    where: {
      author: { email: userEmail },
    },
  });

  let newsletterId;
  if (existingNewsletter) {
    console.info("ONBOARDING", `${userEmail} has a newsletter.`);
    newsletterId = existingNewsletter.id;
  } else {
    console.info("ONBOARDING", `Creating newsletter for ${userEmail}.`);
    const newNewsletter = await prisma.newsletter.create({
      data: {
        title: `${session.user.name?.split(" ")[0]}'s letter`,
        author: { connect: { email: userEmail } },
      },
    });
    newsletterId = newNewsletter.id;

    console.info("ONBOARDING", `Populating newsletter with intro issue.`);
    await populateIntroIssue(newNewsletter.id);
  }

  const user = await prisma.user.findFirst({
    where: { email: userEmail },
  });
  const isStripeCustomer = Boolean(user?.stripeCustomerId);
  const hasStripeProduct = Boolean(user?.stripeProductId);

  if (isStripeCustomer) {
    console.info("ONBOARDING", `${userEmail} is a Stripe customer.`);
  } else {
    console.info("ONBOARDING", `Creating a Stripe customer ${userEmail}.`);
    const customer = await stripe.customers.create({
      email: userEmail,
      name: session?.user?.name ?? userEmail,
    });
    await prisma.user.update({
      where: { id: user?.id },
      data: { stripeCustomerId: customer.id },
    });
  }

  if (hasStripeProduct) {
    console.info("ONBOARDING", `${userEmail} has a Stripe product.`);
  } else {
    console.info("ONBOARDING", `Giving free Stripe product to ${userEmail}.`);
    const freeProductId = await getFreeProductId();
    await prisma.user.update({
      where: { id: user?.id },
      data: { stripeProductId: freeProductId },
    });
  }

  console.info("ONBOARDING", "Redirecting to app.");
  res.redirect(getAppBasePath(newsletterId));
}
