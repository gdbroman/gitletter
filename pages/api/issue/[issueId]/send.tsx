import { Issue } from "@prisma/client";
import inlineCss from "inline-css";
import { Base64 } from "js-base64";
import type { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth/core/types";
import { getSession } from "next-auth/react";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import ReactDOMServer from "react-dom/server";
import slugify from "slugify";

import { createOctokitClient } from "../../../../prisma/modules/github";
import prisma from "../../../../prisma/prisma";
import { EmailStyleWrapper } from "../../../../src/components/EmailStyleWrapper";
import { MarkdownParser } from "../../../../src/components/MarkdownParser";
import { getEmailAddress } from "../../../../util/getEmailAddress";
import { getPath } from "../../../../util/getRepoPath";

type FetchedNewsletter = {
  title: string;
  subscribers: { email: string }[];
  githubIntegration: {
    installationId: string;
    repoDir: string;
    repoName: string;
    repoOwner: string;
  };
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const issueId = req.query.issueId as string;
  const { writeToGithub } = req.body;

  const issue = await prisma.issue.findFirst({
    where: { id: issueId },
  });
  const newsletter = await prisma.newsletter.findFirst({
    where: { id: issue.newsletterId },
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

  if (req.method === "POST") {
    const fileName = `${slugify(issue.title).toLowerCase()}.md`;

    sendMail(session, issue, newsletter);
    if (writeToGithub) {
      const { repoName, repoDir, repoOwner, installationId } =
        newsletter.githubIntegration;

      try {
        writeToGithubFn(
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
    }

    // update db entry
    const result = await prisma.issue.update({
      where: { id: issueId },
      data: {
        sentAt: new Date(),
      },
    });

    res.status(200).json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

const sendMail = async (
  session: Session,
  issue: Issue,
  newsletter: FetchedNewsletter
) => {
  const userEmail = session.user.email;
  const userFullName = session.user.name;

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
    <EmailStyleWrapper
      title={issue.title}
      content={<MarkdownParser children={issue.content} />}
    />
  );
  const htmlWithInlineStyling = await inlineCss(htmlString, {
    url: "https://gitletter.co",
  });

  const defaultMailOptions: Mail.Options = {
    from: `${newsletter.title} <${getEmailAddress(newsletter.title)}>`,
    replyTo: `${userFullName} <${userEmail}>`,
    subject: issue.title,
    html: htmlWithInlineStyling,
  };
  newsletter.subscribers.forEach((subscriber) => {
    const mailOptions: Mail.Options = {
      ...defaultMailOptions,
      to: subscriber.email,
    };
    transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  });
};

const writeToGithubFn = async (
  repoName: string,
  repoDir: string,
  repoOwner: string,
  installationId: string,
  fileName: string,
  content: string
) => {
  const octokit = createOctokitClient(installationId);
  const contentEncoded = Base64.encode(content);

  const path = getPath(repoDir, fileName);
  const gitLetterProfile = {
    name: `GitLetter`,
    email: "hello@gitletter.co",
  };
  await octokit.repos.createOrUpdateFileContents({
    owner: repoOwner,
    repo: repoName,
    path,
    message: `feat: Added ${fileName} programatically`,
    content: contentEncoded,
    committer: gitLetterProfile,
    author: gitLetterProfile,
  });
};
