import type { Issue } from "@prisma/client";
import inlineCss from "inline-css";
import { Base64 } from "js-base64";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth/core/types";
import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import ReactDOMServer from "react-dom/server";

import { createOctokitClient } from "../../../../prisma/modules/github";
import prisma from "../../../../prisma/prisma";
import { EmailStyleWrapper } from "../../../../src/components/EmailStyleWrapper";
import { MarkdownParser } from "../../../../src/components/MarkdownParser";
import { gitLetterSocialLinks, siteDomain } from "../../../../util/constants";
import { getEmailAddress } from "../../../../util/getEmailAddress";
import { getPath } from "../../../../util/getRepoPath";
import {
  getTitleFromContent,
  stripFrontMatterFromContent,
} from "../../../../util/strings";
import { unstableGetServerSession } from "../../auth/getServerSession";

export type FetchedNewsletter = {
  title: string;
  subscribers: { email: string }[];
  githubIntegration: {
    installationId: string;
    repoDir: string | null;
    repoName: string | null;
    repoOwner: string | null;
  } | null;
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstableGetServerSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const issueId = req.query.issueId as string;
  const { writeToGithub } = req.body;

  const issue = await prisma.issue.findFirst({
    where: { id: issueId },
  });
  if (!issue) return res.status(404).json({ message: "Issue not found" });

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
  if (!newsletter)
    return res.status(404).json({ message: "Newsletter not found" });

  if (req.method === "POST") {
    sendMail(session, issue, newsletter);

    let deployed = null;
    const ghI = newsletter.githubIntegration;
    if (writeToGithub) {
      if (!ghI || !ghI.repoDir || !ghI.repoName || !ghI.repoOwner)
        return res
          .status(400)
          .json({ message: "Newsletter is not connected to a github repo" });

      const { repoName, repoDir, repoOwner, installationId } = ghI;

      try {
        const octoKitResponse = await writeToGithubFn(
          repoName,
          repoDir,
          repoOwner,
          installationId,
          issue.fileName,
          issue.content
        );
        deployed = octoKitResponse.data.content?.html_url;
      } catch {
        console.error("Error writing to github");
      }
    }

    // update db entry
    const result = await prisma.issue.update({
      where: { id: issueId },
      data: {
        deployed,
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
  const userEmail = session.user?.email;
  const userFullName = session.user?.name;

  const transport = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    auth: {
      user: process.env.SENDGRID_USERNAME,
      pass: process.env.SENDGRID_PASSWORD,
    },
  });

  const title = getTitleFromContent(issue.content) ?? "Untitled";
  const rawContent = stripFrontMatterFromContent(issue.content);
  const defaultMailOptions: Mail.Options = {
    subject: title,
    from: `${newsletter.title} <${getEmailAddress(newsletter.title)}>`,
    replyTo: `${userFullName} <${userEmail}>`,
  };

  newsletter.subscribers.forEach(async (subscriber) => {
    // convert markdown to html
    const htmlString = ReactDOMServer.renderToStaticMarkup(
      <EmailStyleWrapper
        title={title}
        content={<MarkdownParser content={rawContent} />}
        newsletterId={issue.newsletterId}
        newsletterTitle={newsletter.title}
        emailAddress={subscriber.email}
      />
    );
    const htmlWithInlineStyling = await inlineCss(htmlString, {
      url: `https://${siteDomain}`,
    });
    const mailOptions: Mail.Options = {
      ...defaultMailOptions,
      to: subscriber.email,
      html: htmlWithInlineStyling,
    };
    transport.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        console.error(err);
      } else {
        console.info(info);
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
    email: gitLetterSocialLinks.email,
  };
  return octokit.repos.createOrUpdateFileContents({
    owner: repoOwner,
    repo: repoName,
    path,
    message: `Added ${fileName} programatically.`,
    content: contentEncoded,
    committer: gitLetterProfile,
    author: gitLetterProfile,
  });
};
