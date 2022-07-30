import { NextApiRequest, NextApiResponse } from "next/types";
import { unstable_getServerSession } from "next-auth/next";

import { options } from "./options";

export const unstableGetServerSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => unstable_getServerSession(req, res, options);
