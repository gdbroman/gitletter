export const getPath = (repoDir: string, fileName: string) =>
  repoDir === "./" ? fileName : `${repoDir}/${fileName}`;
