import { Issue } from "@prisma/client";
import inlineCss from "inline-css";
import type { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth/core/types";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import ReactDOMServer from "react-dom/server";

import prisma from "../../../../../prisma/prisma";
import { EmailStyleWrapper } from "../../../../../src/components/EmailStyleWrapper";
import { MarkdownParser } from "../../../../../src/components/MarkdownParser";
import { getEmailAddress } from "../../../../../util/getEmailAddress";
import {
  getTitleFromContent,
  stripFrontMatterFromContent,
} from "../../../../../util/strings";
import { unstableGetServerSession } from "../../../auth/[...nextauth]";
import { FetchedNewsletter } from "../send";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstableGetServerSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const issueId = req.query.issueId as string;
  const email = req.query.email as string;

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
    sendTestEmail(session, issue, newsletter, email);
    res.status(200).json({ message: "Email sent" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

const sendTestEmail = async (
  session: Session,
  issue: Issue,
  newsletter: FetchedNewsletter,
  email: string
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

  const title = "[Preview] " + getTitleFromContent(issue.content);
  const rawContent = stripFrontMatterFromContent(issue.content);
  const defaultMailOptions: Mail.Options = {
    subject: title,
    from: `${newsletter.title} <${getEmailAddress(newsletter.title)}>`,
    replyTo: `${userFullName} <${userEmail}>`,
  };

  const htmlString = ReactDOMServer.renderToStaticMarkup(
    <EmailStyleWrapper
      title={title}
      content={<MarkdownParser children={rawContent} />}
      newsletterId={issue.newsletterId}
      newsletterTitle={newsletter.title}
      emailAddress={email}
    />
  );
  const htmlWithInlineStyling = await inlineCss(htmlString, {
    url: "https://gitletter.co",
  });
  const mailOptions: Mail.Options = {
    ...defaultMailOptions,
    to: email,
    html: htmlWithInlineStyling,
  };
  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};
