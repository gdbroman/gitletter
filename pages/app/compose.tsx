import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { GithubIntegration, Issue } from "@prisma/client";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { ChangeEvent, FC, useCallback, useState } from "react";

import { populateNewIssue } from "../../prisma/modules/issue";
import prisma from "../../prisma/prisma";
import { EmailStyleWrapper } from "../../src/components/EmailStyleWrapper";
import Layout from "../../src/components/Layout";
import { MarkdownParser } from "../../src/components/MarkdownParser";
import { ProtectedPage } from "../../src/components/ProtectedPage";
import { IssueBreadCrumbs } from "../../src/containers/compose/BreadCrumbs";
import { Editor } from "../../src/containers/compose/Editor";
import { SendIssueDialog } from "../../src/containers/compose/SendIssueDialog";
import { issueService } from "../../src/services/issueService";
import { stripDate } from "../../src/types/stripDate";
import { eatClick } from "../../util/eatClick";
import { useToggle } from "../../util/hooks/useToggle";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 401;
    return { props: { issue: {} } };
  }
  const urlSearchParams = new URLSearchParams(
    req.url.substring(req.url.indexOf("?"))
  );
  const newsletterId = urlSearchParams.get("n");
  const issueId = urlSearchParams.get("i");

  let issue: Issue = {} as Issue;
  if (issueId) {
    issue = await prisma.issue.findFirst({
      where: { id: issueId },
    });
  } else if (newsletterId) {
    issue = await populateNewIssue(session.user.email, newsletterId);
  }

  if (!issue) {
    res.statusCode = 302;
    res.setHeader("location", "/app");
    return { props: { issue: {} } };
  } else {
    const newsletter = await prisma.newsletter.findFirst({
      where: { id: issue.newsletterId },
      select: {
        title: true,
        githubIntegration: true,
        subscribers: true,
      },
    });
    return {
      props: {
        issue: stripDate(issue),
        newsletterTitle: newsletter.title,
        subscriberCount: newsletter.subscribers.length,
        githubIntegration: newsletter.githubIntegration,
      },
    };
  }
};

type Props = {
  issue: Issue;
  newsletterTitle: string;
  subscriberCount: number;
  githubIntegration: GithubIntegration;
};

const Compose: FC<Props> = ({
  issue,
  newsletterTitle,
  subscriberCount,
  githubIntegration,
}) => {
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
  const handleContentChange = (newValue: string) => {
    setContent(newValue);
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
  const handleContentBlur = useCallback(async () => {
    if (content !== savedContent) {
      await handleSave();
      setSavedContent(content);
    }
  }, [content, handleSave, savedContent]);
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
    <ProtectedPage>
      <Layout
        footer={
          <footer style={{ backgroundColor: "#eeeeee" }}>
            <Box display="flex" justifyContent="end" p={2} gap={2}>
              <Button variant="text" onClick={preview.toggle}>
                {preview.isOn ? "Edit" : "Preview"}
              </Button>
              <Button variant="contained" onClick={handleAreYouSure}>
                Send
              </Button>
            </Box>
            <SendIssueDialog
              subscriberCount={subscriberCount}
              githubIntegration={githubIntegration}
              open={areYouSure.isOn}
              loading={sending.isOn}
              onCancel={areYouSure.toggleOff}
              onSubmit={handleSend}
            />
          </footer>
        }
      >
        <NextSeo title={title} />
        <IssueBreadCrumbs
          title={title}
          newsletterTitle={newsletterTitle}
          onTitleChange={handleTitleChange}
          onTitleBlur={handleTitleBlur}
        />
        {preview.isOn ? (
          <EmailStyleWrapper
            title={title}
            content={<MarkdownParser children={content} />}
            newsletterId={issue.newsletterId}
          />
        ) : (
          <Editor
            value={content}
            onChange={handleContentChange}
            onBlur={handleContentBlur}
          />
        )}
        {isSent && (
          <Typography variant="body1" color="textSecondary" my={4}>
            {`Sent on ${issue.sentAt}`}
          </Typography>
        )}
      </Layout>
    </ProtectedPage>
  );
};

export default Compose;
