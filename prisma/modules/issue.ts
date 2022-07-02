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
    "## Hey there 👋",
    "Before we get going, click **Preview** down below",
    "Ah, much better! As you can gather, this is a markdown editor",
    "It's where the magic happens ✨",
    "And I think that's all you need to know",
    "Now let's get writing!",
    "---",
    "## About me",
    "I'm Gustaf, the creator of GitLetter",
    "My goal is to help you compose with joy 🕊",
    "So if you have suggestions, don't hesitate to reach out",
    "Talk soon,",
    "Gustaf (@gdbroman on Twitter)",
  ].join("\n\n");

  await createIssue("Compose with joy 🕊", content, authorEmail, newsletterId);
};
