import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Issue } from "@prisma/client";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { ChangeEvent, FC, useState } from "react";
import ReactMarkdown from "react-markdown";

import Layout from "../../src/components/Layout";
import { ProtectedPage } from "../../src/components/ProtectedPage";
import prisma from "../../src/prisma/prisma";
import { dateStripped } from "../../src/types/helpers";
import { useToggle } from "../../src/util/hooks";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { issue: {} } };
  }
  let issue: Issue = {} as Issue;
  const urlSearchParams = new URLSearchParams(
    req.url.substring(req.url.indexOf("?"))
  );
  const issueId = urlSearchParams.get("i");
  const newsletterId = urlSearchParams.get("n");

  if (!newsletterId) {
    res.statusCode = 404;
  }

  if (!issueId) {
    issue = await prisma.issue.create({
      data: {
        title: "Hello world!",
        content: "I say unto you...",
        sent: false,
        newsletter: { connect: { id: newsletterId } },
        author: { connect: { email: session?.user?.email } },
      },
    });
  } else {
    issue = await prisma.issue.findFirst({
      where: { id: issueId },
    });
  }

  return { props: { issue: dateStripped(issue) } };
};

type Props = {
  issue: Issue;
};

const Compose: FC<Props> = ({ issue }) => {
  const router = useRouter();

  const [title, setTitle] = useState(issue.title);
  const [content, setContent] = useState(issue.content);
  const preview = useToggle(false);

  const handleTitleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContent(e.target.value);
  };

  const handleSend = async () => {
    try {
      await fetch("/api/issue", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          issueId: issue.id,
        }),
      });
      await router.push("/app");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ProtectedPage>
      <Layout>
        <NextSeo title={title} />
        <article>
          <Box my={4}>
            {preview.isOn ? (
              <Typography variant="h1" fontWeight={500} paddingY={1}>
                {title}
              </Typography>
            ) : (
              <TextField
                fullWidth
                variant="standard"
                inputProps={{
                  style: { fontSize: 40, fontWeight: 500, padding: "8px 0" },
                }}
                value={title}
                onChange={handleTitleChange}
              />
            )}
          </Box>
          <Box>
            {preview.isOn ? (
              <ReactMarkdown children={content} />
            ) : (
              <TextField
                fullWidth
                multiline
                maxRows={999}
                value={content}
                onChange={handleContentChange}
              />
            )}
          </Box>
        </article>
        <Box display="flex" justifyContent="end" my={4} gap={2}>
          <Button variant="text" color="primary" onClick={preview.toggle}>
            {preview.isOn ? "Edit" : "Preview"}
          </Button>
          <Button variant="contained" color="primary" onClick={handleSend}>
            Save
          </Button>
        </Box>
      </Layout>
    </ProtectedPage>
  );
};

export default Compose;
