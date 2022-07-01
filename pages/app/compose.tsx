import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Issue } from "@prisma/client";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { ChangeEvent, FC, useCallback, useState } from "react";

import prisma from "../../prisma/prisma";
import Layout from "../../src/components/Layout";
import { MarkdownParser } from "../../src/components/MarkdownParser";
import { ProtectedPage } from "../../src/components/ProtectedPage";
import { SendIssueDialog } from "../../src/containers/compose/SendIssueDialog";
import { useToggle } from "../../src/hooks/useToggle";
import { issueService } from "../../src/services/issueService";
import { stripDate } from "../../src/types/stripDate";
import { eatClick } from "../../util/eatClick";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 401;
    return { props: { issue: {} } };
  }
  let issue: Issue = {} as Issue;
  const urlSearchParams = new URLSearchParams(
    req.url.substring(req.url.indexOf("?"))
  );
  const newsletterId = urlSearchParams.get("n");
  const issueId = urlSearchParams.get("i");

  if (!newsletterId && !issueId) {
    res.statusCode = 404;
    return { props: { issue: {} } };
  }

  if (!issueId) {
    issue = await prisma.issue.create({
      data: {
        title: "Hello world",
        content: "And I spoke thusly.",
        newsletter: { connect: { id: newsletterId } },
        author: { connect: { email: session?.user?.email } },
      },
    });
  } else {
    issue = await prisma.issue.findFirst({
      where: { id: issueId },
    });
  }

  return { props: { issue: stripDate(issue) } };
};

type Props = {
  issue: Issue;
};

const Compose: FC<Props> = ({ issue }) => {
  const router = useRouter();

  const [title, setTitle] = useState(issue.title);
  const [content, setContent] = useState(issue.content);
  const [savedTitle, setSavedTitle] = useState(issue.title);
  const [savedContent, setSavedContent] = useState(issue.content);

  const isSent = issue.sentAt ? true : false;
  const preview = useToggle(isSent);
  const sending = useToggle(false);
  const areYouSure = useToggle(false);

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
  const handleSave = useCallback(async () => {
    try {
      await issueService.updateIssue(issue.id, title, content);
    } catch (error) {
      console.error(error);
    }
  }, [content, issue.id, title]);

  const handleTitleBlur = useCallback(
    async (e: any) => {
      eatClick(e);
      if (title !== savedTitle) {
        await handleSave();
        setSavedTitle(title);
      }
    },
    [handleSave, savedTitle, title]
  );
  const handleContentBlur = useCallback(
    async (e: any) => {
      eatClick(e);
      if (content !== savedContent) {
        await handleSave();
        setSavedContent(content);
      }
    },
    [content, handleSave, savedContent]
  );
  const handleAreYouSure = async () => {
    areYouSure.toggleOn();
    await handleSave();
  };
  const handleSend = async (writeToGithub: boolean) => {
    sending.toggleOn();
    try {
      await issueService.sendIssue(issue.id, writeToGithub);
      await router.push("/app/sent");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ProtectedPage>
        <Layout>
          <NextSeo title={title} />
          <Card variant="outlined">
            <Box p={4}>
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
                      style: {
                        fontSize: 40,
                        fontWeight: 500,
                        padding: "8px 0",
                      },
                    }}
                    value={title}
                    onBlur={handleTitleBlur}
                    onChange={handleTitleChange}
                  />
                )}
              </Box>
              <Box>
                {preview.isOn ? (
                  <MarkdownParser children={content} />
                ) : (
                  <TextField
                    fullWidth
                    multiline
                    value={content}
                    onBlur={handleContentBlur}
                    onChange={handleContentChange}
                  />
                )}
              </Box>
            </Box>
          </Card>
          {isSent ? (
            <Typography variant="body1" color="textSecondary" my={4}>
              {`Sent on ${issue.sentAt}`}
            </Typography>
          ) : (
            <Box display="flex" justifyContent="end" my={4} gap={2}>
              <Button variant="text" color="primary" onClick={preview.toggle}>
                {preview.isOn ? "Edit" : "Preview"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAreYouSure}
              >
                Send
              </Button>
              <SendIssueDialog
                newsletterId={issue.newsletterId}
                open={areYouSure.isOn}
                loading={sending.isOn}
                onCancel={areYouSure.toggleOff}
                onSubmit={handleSend}
              />
            </Box>
          )}
        </Layout>
      </ProtectedPage>
      {/* <CustomSnackbar
        message={"Saved!"}
        severity="success"
        isOpen={saved.isOn}
        onClose={saved.toggleOff}
      /> */}
    </>
  );
};

export default Compose;
