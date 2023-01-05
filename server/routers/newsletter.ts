import { z } from "zod";

import prisma from "../../prisma/prisma";
import { procedure, router } from "../trpc";

export const newsletterRouter = router({
  get: procedure
    .input(
      z.object({
        newsletterId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const newsletter = prisma.newsletter.findFirst({
        where: { id: input.newsletterId },
        select: {
          id: true,
          title: true,
          issues: true,
        },
      });

      return newsletter;
    }),
});
