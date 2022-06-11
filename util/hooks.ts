import { useSession } from "next-auth/react";

import prisma from "../lib/prisma";

export const useGetNewsletter = () => {
  const { data: session } = useSession();
  return prisma.newsletter.findFirst({
    where: { author: { email: session?.user.email } },
  });
};
