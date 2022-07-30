import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import unstable_getServerSession from "next-auth/next";
import GitHubProvider from "next-auth/providers/github";

import prisma from "../../../prisma/prisma";

const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
};

const authHandler: NextApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => NextAuth(req, res, options);

export default authHandler;

export const unstableGetServerSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => unstable_getServerSession(req, res, options);
