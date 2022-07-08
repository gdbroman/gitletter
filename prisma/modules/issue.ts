import prisma from "../prisma";

export const createIssue = (
  title: string,
  content: string,
  authorEmail: string,
  newsletterId: string
) =>
  prisma.issue.create({
    data: {
      title,
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
  const content = "";
  return createIssue(title, content, authorEmail, newsletterId);
};

export const populateIntroIssue = async (
  authorEmail: string,
  newsletterId: string
) => {
  const content = [
    "Hi there 👋",
    "This is a markdown editor",
    "It's where your magic happens ✨",
    "Try clicking the **Preview** button below",
    "And that is all you need to know",
    "Let's get writing!\n",
  ].join("\n\n");

  await createIssue("Start here 🙋", content, authorEmail, newsletterId);
};
