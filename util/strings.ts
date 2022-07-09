import slugify from "slugify";

export const getTimeAgoString = (dateString: Date) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  } else if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else if (days < 30) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  } else if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }
};

export const stringToMarkdownFileName = (s: string) =>
  `${slugify(s.replace(/\.md$/, ""), {
    lower: true,
  })}.md`;

export const getFrontMatterFromContent = (content: string): string[] | null => {
  const lines = content
    .trim()
    .split("\n")
    .filter((line) => !!line.length);
  const frontMatterStart = lines.indexOf("---");
  const frontMatterEnd = lines.indexOf("---", frontMatterStart + 1);
  if (frontMatterStart === -1 || frontMatterEnd === -1) return null;
  const frontMatter = lines.slice(frontMatterStart + 1, frontMatterEnd);
  return frontMatter;
};

export const getTitleFromContent = (content: string): string | null => {
  const frontMatter = getFrontMatterFromContent(content);
  if (!frontMatter) return null;
  const titleLine = frontMatter.find((line) => line.startsWith("title: "));
  return titleLine.split(":")[1].trim() ?? null;
};

export const stripFrontMatterFromContent = (content: string): string => {
  const frontMatter = getFrontMatterFromContent(content);
  if (!frontMatter) return content;
  const frontMatterStart = content.indexOf("---");
  const frontMatterEnd = content.indexOf("---", frontMatterStart + 1);
  if (frontMatterStart === -1 || frontMatterEnd === -1) return content;
  return content.slice(frontMatterEnd + 3).trim();
};

export const createFrontMatter = (title: string) => `---\ntitle: ${title}\n---`;
