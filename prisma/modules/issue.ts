import {
  createFrontMatter,
  stringToMarkdownFileName,
} from "../../util/strings";
import prisma from "../prisma";

export const createIssue = (
  fileName: string,
  content: string,
  authorEmail: string,
  newsletterId: string
) =>
  prisma.issue.create({
    data: {
      fileName,
      content,
      author: { connect: { email: authorEmail } },
      newsletter: { connect: { id: newsletterId } },
    },
  });

export const populateNewIssue = async (
  authorEmail: string,
  newsletterId: string
) => {
  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId },
    select: { title: true, issues: true },
  });
  if (!newsletter) return null;

  const count = newsletter.issues.length;
  const title = `${newsletter.title} #${count}`;
  const fileName = stringToMarkdownFileName(title);
  const content = [createFrontMatter(title), ""].join("\n\n");
  return createIssue(fileName, content, authorEmail, newsletterId);
};

export const populateIntroIssue = async (
  authorEmail: string,
  newsletterId: string
) => {
  const title = "Start here";
  const fileName = "start-here.md";
  const content = [
    createFrontMatter(title),
    "Hi there 👋",
    "This is a markdown editor",
    "It's where the magic happens ✨",
    "Try clicking the **Preview** button below",
    "And that is all you need to know",
    "Let's get writing!\n",
  ].join("\n\n");

  await createIssue(fileName, content, authorEmail, newsletterId);
};
