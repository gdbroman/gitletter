import {
  createFrontMatter,
  stringToMarkdownFileName,
} from "../../util/strings";
import prisma from "../prisma";

export const createIssue = (
  fileName: string,
  content: string,
  newsletterId: string
) =>
  prisma.issue.create({
    data: {
      fileName,
      content,
      newsletter: { connect: { id: newsletterId } },
    },
  });

export const populateNewIssue = async (newsletterId: string) => {
  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId },
    select: { title: true, issues: true },
  });
  if (!newsletter) return null;

  const count = newsletter.issues.length;
  const title = `${newsletter.title} #${count}`;
  const fileName = stringToMarkdownFileName(title);
  const content = [createFrontMatter(title), ""].join("\n\n");
  return createIssue(fileName, content, newsletterId);
};

export const populateIntroIssue = async (newsletterId: string) => {
  const title = "Start here";
  const fileName = "start-here.md";
  const content = [
    createFrontMatter(title),
    "Hi there 👋",
    "This is a markdown editor",
    "It's where the magic happens ✨",
    "Try clicking the preview eye icon below",
    "Now let's get writing!\n",
  ].join("\n\n");

  await createIssue(fileName, content, newsletterId);
};
