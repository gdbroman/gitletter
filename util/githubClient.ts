export async function getRepos(githubInstallationId: string): Promise<any> {
  return fetch(
    `${process.env.APP_URL}/api/github/app/${githubInstallationId}`,
    {
      method: "GET",
    }
  );
}

export async function deleteIntegration(
  githubInstallationId: string
): Promise<any> {
  await fetch(`${process.env.APP_URL}/api/github/app/${githubInstallationId}`, {
    method: "DELETE",
  });
}
