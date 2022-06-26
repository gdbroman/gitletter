import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import ReactDOMServer from "react-dom/server";

import prisma from "../../../prisma/prisma";
import { MarkdownParser } from "../../../src/components/MarkdownParser";

// POST /api/issue/send
export default async function handle(req, res) {
  const { issueId } = req.body;

  if (req.method === "POST") {
    // send email to all subscribers
    const subscribers = ["99gustaf@gmail.com"];
    const issue = await prisma.issue.findFirst({
      where: { id: issueId },
    });

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
      from: "hello@gitletter.co",
      to: subscribers,
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

    // TODO: write to github repo

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
