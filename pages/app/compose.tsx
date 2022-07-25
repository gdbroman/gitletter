import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { GithubIntegration, Issue } from "@prisma/client";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";

import { populateNewIssue } from "../../prisma/modules/issue";
import prisma from "../../prisma/prisma";
import { EmailArticle } from "../../src/components/EmailStyleWrapper";
import Layout from "../../src/components/Layout";
import { MarkdownParser } from "../../src/components/MarkdownParser";
import { ProtectedPage } from "../../src/components/ProtectedPage";
import { ComposeBreadCrumbs } from "../../src/containers/compose/ComposeBreadCrumbs";
import {
  ComposeControls,
  composeControlsFooterHeight,
} from "../../src/containers/compose/ComposeControls";
import { Editor } from "../../src/containers/compose/Editor";
import { SendIssueDialog } from "../../src/containers/compose/SendIssueDialog";
import { SendTestEmailDialog } from "../../src/containers/compose/SendTestEmailDialog";
import { issueService } from "../../src/services/issueService";
import { stripDate } from "../../src/types/stripDate";
import { eatClick } from "../../util/eatClick";
import { useToggle } from "../../util/hooks/useToggle";
import { progressIndicator } from "../../util/lib/progressIndicator";
import {
  getTitleFromContent,
  stringToMarkdownFileName,
  stripFrontMatterFromContent,
} from "../../util/strings";

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
        userEmail: session.user.email,
        subscriberCount: newsletter.subscribers.length,
        githubIntegration: newsletter.githubIntegration,
      },
    };
  }
};

type Props = {
  issue: Issue;
  newsletterTitle: string;
  userEmail: string;
  subscriberCount: number;
  githubIntegration: GithubIntegration;
};

const Compose: FC<Props> = ({
  issue,
  newsletterTitle,
  userEmail,
  subscriberCount,
  githubIntegration,
}) => {
  const router = useRouter();

  const [fileName, setFileName] = useState(issue.fileName);
  const [content, setContent] = useState(issue.content);
  const [savedFileName, setSavedFileName] = useState(issue.fileName);
  const [savedContent, setSavedContent] = useState(issue.content);

  const isFileNameChanged = useMemo(
    () => fileName !== savedFileName,
    [fileName, savedFileName]
  );
  const isContentChanged = useMemo(
    () => content !== savedContent,
    [content, savedContent]
  );
  const isIssueChanged = useMemo(
    () => isFileNameChanged || isContentChanged,
    [isFileNameChanged, isContentChanged]
  );

  const isSent = issue.sentAt ? true : false;
  const sendTestEmail = useToggle(false);
  const previewEmail = useToggle(isSent);
  const sending = useToggle(false);
  const areYouSure = useToggle(false);

  const saveIssue = useCallback(
    async (overrideFileName?: string) => {
      try {
        progressIndicator.start();
        await issueService.updateIssue(
          issue.id,
          overrideFileName ?? fileName,
          content
        );
      } catch (error) {
        console.error(error);
      } finally {
        progressIndicator.done();
      }
    },
    [content, issue.id, fileName]
  );

  const handleFileNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFileName(e.target.value);
    },
    []
  );
  const handleContentChange = useCallback((newValue: string) => {
    setContent(newValue);
  }, []);
  const handleFileNameBlur = useCallback(
    async (e: any) => {
      eatClick(e);
      if (isFileNameChanged) {
        const lintedFileName = stringToMarkdownFileName(fileName);
        setFileName(lintedFileName);
        await saveIssue(lintedFileName);
        setSavedFileName(lintedFileName);
      }
    },
    [fileName, isFileNameChanged, saveIssue]
  );
  const handleContentBlur = useCallback(async () => {
    if (isContentChanged) {
      await saveIssue();
      setSavedContent(content);
    }
  }, [content, isContentChanged, saveIssue]);
  const handleAreYouSure = useCallback(async () => {
    areYouSure.toggleOn();
    if (isIssueChanged) {
      await saveIssue();
    }
  }, [areYouSure, isIssueChanged, saveIssue]);
  const handleSend = useCallback(
    async (writeToGithub: boolean) => {
      sending.toggleOn();
      try {
        await issueService.sendIssue(issue.id, writeToGithub);
        router.reload();
      } catch (error) {
        console.error(error);
      }
    },
    [issue.id, router, sending]
  );

  return (
    <ProtectedPage>
      <Layout
        footer={
          !isSent ? (
            <ComposeControls
              isPreview={previewEmail.isOn}
              toggleTest={sendTestEmail.toggleOn}
              togglePreview={previewEmail.toggle}
              onClickSend={handleAreYouSure}
            />
          ) : null
        }
      >
        <NextSeo title={fileName} />
        <ComposeBreadCrumbs
          fileName={fileName}
          newsletterTitle={newsletterTitle}
          disableEdit={isSent}
          onChange={handleFileNameChange}
          onBlur={handleFileNameBlur}
        />
        {previewEmail.isOn ? (
          <Box display="flex" justifyContent="center">
            <EmailArticle
              title={getTitleFromContent(content)}
              content={
                <MarkdownParser
                  children={stripFrontMatterFromContent(content)}
                />
              }
            />
          </Box>
        ) : (
          <Editor
            value={content}
            onChange={handleContentChange}
            onBlur={handleContentBlur}
          />
        )}
        {isSent && (
          <Typography
            variant="body2"
            color="textSecondary"
            my={4}
            textAlign="center"
          >
            Sent{" "}
            {!!issue.deployed ? (
              <>
                and{" "}
                <Link href={issue.deployed} target="_blank">
                  deployed
                </Link>{" "}
              </>
            ) : (
              ""
            )}
            {new Date(issue.sentAt).toLocaleString()}
          </Typography>
        )}
        <Box height={composeControlsFooterHeight} />
      </Layout>
      <SendTestEmailDialog
        issueId={issue.id}
        defaultEmailAddress={userEmail}
        open={sendTestEmail.isOn}
        onClose={sendTestEmail.toggleOff}
      />
      <SendIssueDialog
        subscriberCount={subscriberCount}
        githubIntegration={githubIntegration}
        open={areYouSure.isOn}
        loading={sending.isOn}
        onCancel={areYouSure.toggleOff}
        onSubmit={handleSend}
      />
    </ProtectedPage>
  );
};

export default Compose;
