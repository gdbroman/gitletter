import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { GithubIntegration, Issue } from "@prisma/client";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { populateNewIssue } from "../../../prisma/modules/issue";
import { getFreeProductId } from "../../../prisma/modules/stripe";
import prisma from "../../../prisma/prisma";
import { EmailArticle } from "../../../src/components/EmailStyleWrapper";
import Layout from "../../../src/components/Layout";
import { MarkdownParser } from "../../../src/components/MarkdownParser";
import { ProtectedPage } from "../../../src/components/ProtectedPage";
import {
  ComposeControls,
  composeControlsFooterHeight,
} from "../../../src/containers/compose/ComposeControls";
import { Editor } from "../../../src/containers/compose/Editor";
import { IssueSettingsDialog } from "../../../src/containers/compose/IssueSettingsDialog";
import { SendIssueDialog } from "../../../src/containers/compose/SendIssueDialog";
import { SendTestEmailDialog } from "../../../src/containers/compose/SendTestEmailDialog";
import { issueService } from "../../../src/services/issueService";
import { stripDate } from "../../../src/types/stripDate";
import { useAppHref } from "../../../util/hooks/useAppHref";
import { useToggle } from "../../../util/hooks/useToggle";
import { progressIndicator } from "../../../util/lib/progressIndicator";
import {
  getTitleFromContent,
  stripFrontMatterFromContent,
} from "../../../util/strings";

export const getServerSideProps: GetServerSideProps = async ({
  res,
  query,
}) => {
  const newsletterId = query.newsletterId as string;
  const issueId = query.i as string;

  let issue: Issue = {} as Issue;
  if (!newsletterId) {
    res.statusCode = 302;
    res.setHeader("location", "/404");
    return { props: { issue: {} } };
  }

  if (issueId) {
    issue = await prisma.issue.findFirst({
      where: { id: issueId },
    });
  } else {
    issue = await populateNewIssue(newsletterId);
  }

  if (!issue) {
    res.statusCode = 302;
    res.setHeader("location", "/404");
    return { props: { issue: {} } };
  } else {
    const newsletter = await prisma.newsletter.findFirst({
      where: { id: issue.newsletterId },
      select: {
        title: true,
        githubIntegration: true,
        subscribers: true,
        author: {
          select: {
            stripeProductId: true,
          },
        },
      },
    });
    const freeProductId = await getFreeProductId();
    const hasFreeProduct = newsletter.author.stripeProductId === freeProductId;

    return {
      props: {
        issue: stripDate(issue),
        newsletterTitle: newsletter.title,
        subscriberCount: newsletter.subscribers.length,
        githubIntegration: newsletter.githubIntegration,
        hasFreeProduct,
      },
    };
  }
};

type Props = {
  issue: Issue;
  newsletterTitle: string;
  subscriberCount: number;
  githubIntegration: GithubIntegration;
  hasFreeProduct: boolean;
};

const Compose: FC<Props> = ({
  issue,
  newsletterTitle,
  subscriberCount,
  githubIntegration,
  hasFreeProduct,
}) => {
  const router = useRouter();
  const { data } = useSession();
  const appHref = useAppHref();

  const [content, setContent] = useState(issue.content);
  const [savedContent, setSavedContent] = useState(issue.content);

  useEffect(() => {
    if (!router.query.i) {
      router.push(`${appHref}/compose/?i=${issue.id}`, undefined, {
        shallow: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appHref, issue.id]);

  const title = useMemo(() => getTitleFromContent(content), [content]);
  const isContentChanged = useMemo(
    () => content !== savedContent,
    [content, savedContent]
  );
  const isSent = useMemo(() => !!issue.sentAt, [issue.sentAt]);

  const showSetings = useToggle(false);
  const sendTestEmail = useToggle(false);
  const previewEmail = useToggle(isSent);
  const sending = useToggle(false);
  const areYouSure = useToggle(false);

  const saveIssueContent = useCallback(async () => {
    try {
      progressIndicator.start();
      await issueService.updateIssue({ issueId: issue.id, content });
    } catch (error) {
      console.error(error);
    } finally {
      progressIndicator.done();
    }
  }, [content, issue.id]);

  const handleContentChange = useCallback((newValue: string) => {
    setContent(newValue);
  }, []);
  const handleContentBlur = useCallback(async () => {
    if (isContentChanged) {
      await saveIssueContent();
      setSavedContent(content);
    }
  }, [content, isContentChanged, saveIssueContent]);
  const handleAreYouSure = useCallback(async () => {
    areYouSure.toggleOn();
    if (isContentChanged) {
      await saveIssueContent();
    }
  }, [areYouSure, isContentChanged, saveIssueContent]);
  const handleSend = useCallback(
    async (writeToGithub: boolean) => {
      sending.toggleOn();
      try {
        await issueService.sendIssue(issue.id, writeToGithub);
      } catch (error) {
        console.error(error);
      } finally {
        router.reload();
      }
    },
    [issue.id, router, sending]
  );

  return (
    <ProtectedPage>
      <Layout
        headerTitle={newsletterTitle}
        footer={
          !isSent ? (
            <ComposeControls
              isPreview={previewEmail.isOn}
              toggleSettings={showSetings.toggle}
              togglePreview={previewEmail.toggle}
              toggleTest={sendTestEmail.toggleOn}
              toggleSend={handleAreYouSure}
            />
          ) : null
        }
      >
        <NextSeo title={title} />

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
      <IssueSettingsDialog
        issueId={issue.id}
        initialFileName={issue.fileName}
        open={showSetings.isOn}
        onClose={showSetings.toggleOff}
      />
      <SendTestEmailDialog
        issueId={issue.id}
        defaultEmailAddress={data?.user?.email}
        open={sendTestEmail.isOn}
        onClose={sendTestEmail.toggleOff}
      />
      <SendIssueDialog
        subscriberCount={subscriberCount}
        hasFreeProduct={hasFreeProduct}
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
