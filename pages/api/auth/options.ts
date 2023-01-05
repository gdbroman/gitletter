import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";

import prisma from "../../../prisma/prisma";

if (!process.env.GITHUB_OAUTH_CLIENT_ID) {
  throw new Error("GITHUB_OAUTH_CLIENT_ID is not defined.");
}

if (!process.env.GITHUB_OAUTH_CLIENT_SECRET) {
  throw new Error("GITHUB_OAUTH_CLIENT_SECRET is not defined.");
}

export const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
};
