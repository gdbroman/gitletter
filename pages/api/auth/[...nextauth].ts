import type { NextApiRequest, NextApiResponse } from "next";
import { NextApiHandler } from "next";
import NextAuth from "next-auth";

import { options } from "./options";

const authHandler: NextApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => NextAuth(req, res, options);

export default authHandler;
