import { Issue } from "@prisma/client";
import { Base64 } from "js-base64";
import { Session } from "next-auth/core/types";
import { getSession } from "next-auth/react";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import ReactDOMServer from "react-dom/server";
import slugify from "slugify";

import prisma from "../../../prisma/prisma";
import { MarkdownParser } from "../../../src/components/MarkdownParser";
import { createOctokitClient } from "../github/app/[...installationId]";

// POST /api/issue/send
export default async function handle(req, res) {
  const { issueId, newsletterId } = req.body;

  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return;
  }

  const newsletter = await prisma.newsletter.findFirst({
    where: { id: newsletterId },
    select: {
      title: true,
      subscribers: {
        select: { email: true },
      },
      githubIntegration: {
        select: {
          installationId: true,
          repoDir: true,
          repoName: true,
          repoOwner: true,
        },
      },
    },
  });
  const issue = await prisma.issue.findFirst({
    where: { id: issueId },
  });

  if (req.method === "POST") {
    const fileName = `${slugify(issue.title).toLowerCase()}.md`;
    const { repoName, repoDir, repoOwner, installationId } =
      newsletter.githubIntegration;

    sendMail(session, issue, newsletter);
    try {
      writeToGithub(
        repoName,
        repoDir,
        repoOwner,
        installationId,
        fileName,
        issue.content
      );
    } catch {
      console.log("Error writing to github");
    }

    // update db entry
    const result = await prisma.issue.update({
      where: { id: issueId },
      data: {
        sentAt: new Date(),
      },
    });

    res.json(result);
  }
}

const sendMail = async (session: Session, issue: Issue, newsletter: any) => {
  const userEmail = session.user.email;
  const userFullName = session.user.name;
  const userName = userFullName.split(" ")[0].toLowerCase();

  const transport = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    auth: {
      user: process.env.SENDGRID_USERNAME,
      pass: process.env.SENDGRID_PASSWORD,
    },
  });

  // convert markdown to html
  const htmlString = ReactDOMServer.renderToStaticMarkup(
    <MarkdownParser children={issue.content} />
  );

  const mailOptions: Mail.Options = {
    from: `${newsletter.title} <${userName}@gitletter.co>`,
    replyTo: `${userFullName} <${userEmail}>`,
    to: `You <${userName}s-fans@gitletter.co>`,
    bcc: newsletter.subscribers.map((subscriber) => subscriber.email),
    subject: issue.title,
    html: htmlString,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

const writeToGithub = async (
  repoName: string,
  repoDir: string,
  repoOwner: string,
  installationId: string,
  fileName: string,
  content: string
) => {
  const octokit = createOctokitClient(installationId);
  const contentEncoded = Base64.encode(content);

  const gitLetterProfile = {
    name: `GitLetter`,
    email: "hello@gitletter.co",
  };
  await octokit.repos.createOrUpdateFileContents({
    owner: repoOwner,
    repo: repoName,
    path: `${repoDir}/${fileName}`,
    message: `feat: Added ${fileName} programatically`,
    content: contentEncoded,
    committer: gitLetterProfile,
    author: gitLetterProfile,
  });
};
