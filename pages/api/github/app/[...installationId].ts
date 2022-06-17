import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";

import prisma from "../../../../util/prisma";

// DELETE & GET/api/github/app/:id
export default async function handler(req, res) {
  const installationId = req.query.installationId[0];

  if (req.method === "DELETE") {
    const integration = await deleteIntegration(installationId);
    res.json(integration);
  } else {
    const client = createClient(installationId);
    const repos = await client.paginate(
      client.apps.listReposAccessibleToInstallation
    );

    res.json(repos);
  }
}

function createClient(installationId?: number): Octokit {
  const appId = process.env.GITHUB_APP_ID;
  const privateKeyBase64 = process.env.GITHUB_APP_PRIVATE_KEY as string;
  const privateKey = Buffer.from(privateKeyBase64, "base64").toString();

  return new Octokit(
    !!installationId
      ? {
          authStrategy: createAppAuth,
          auth: {
            appId,
            privateKey,
            installationId,
          },
        }
      : undefined
  );
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
