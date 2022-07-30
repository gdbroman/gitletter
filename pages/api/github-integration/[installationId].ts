import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../prisma/prisma";
import { unstableGetServerSession } from "../auth/getServerSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstableGetServerSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const installationId = req.query.installationId as string;

  if (req.method === "GET") {
    const integration = await getIntegration(installationId);
    res.status(200).json(integration);
  } else if (req.method === "DELETE") {
    const integration = await deleteIntegration(installationId);
    res.status(200).json(integration);
  } else if (req.method === "PUT") {
    const { repoName, repoDir, repoOwner } = req.body;
    const integration = await updateIntegration(
      installationId,
      repoName,
      repoDir,
      repoOwner
    );
    res.status(200).json(integration);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

function getIntegration(installationId: string) {
  try {
    return prisma.githubIntegration.findFirst({
      where: {
        installationId,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

function updateIntegration(
  installationId: string,
  repoName: string,
  repoDir: string,
  repoOwner: string
) {
  try {
    return prisma.githubIntegration.update({
      where: {
        installationId,
      },
      data: {
        repoName,
        repoDir,
        repoOwner,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

function deleteIntegration(installationId: string) {
  try {
    return prisma.githubIntegration.delete({
      where: {
        installationId,
      },
    });
  } catch (error) {
    console.error(error);
  }
}
