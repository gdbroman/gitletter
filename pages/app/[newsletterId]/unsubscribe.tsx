import LoadingButton from "@mui/lab/LoadingButton";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import { useRouter } from "next/router";
import type { GetServerSideProps, NextPage } from "next/types";
import { NextSeo } from "next-seo";
import type { ChangeEventHandler } from "react";
import { useState } from "react";

import prisma from "../../../prisma/prisma";
import { FeedbackFooter } from "../../../src/components/FeedbackFooter";
import Layout from "../../../src/components/Layout";
import { newsletterService } from "../../../src/services/newsletterService";
import { useToggle } from "../../../util/hooks/useToggle";
import { isValidEmail } from "../../../util/strings";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const newsletterId = query.newsletterId as string;

  const newsletter = await prisma.newsletter.findFirst({
    where: { id: newsletterId },
    select: {
      title: true,
    },
  });

  if (!newsletter) {
    return {
      props: {},
    };
  }

  return {
    props: {
      newsletterId,
      newsletterTitle: newsletter.title,
    },
  };
};

type Props = {
  newsletterId: string;
  newsletterTitle: string;
};

const UnsubscribedPage: NextPage<Props> = ({
  newsletterId,
  newsletterTitle,
}) => {
  const router = useRouter();
  const [email, setEmail] = useState(router.query.email as string);
  const [error, setError] = useState(false);
  const loading = useToggle();

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = async () => {
    setError(false);
    loading.toggleOn();
    const res = await newsletterService.unsubscribe(newsletterId, email);
    console.log("Res", res);
    if (res) {
      router.push(`/app/${newsletterId}/unsubscribed`);
    } else {
      setError(true);
      loading.toggleOff();
    }
  };

  return (
    <Layout footer={<FeedbackFooter />}>
      <NextSeo title="Unsubscribe" />
      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        my={8}
        mx="auto"
        textAlign="center"
        maxWidth="500px"
      >
        <Typography variant="h1" fontWeight="bold">
          {newsletterTitle}
        </Typography>
        <Input
          type="email"
          placeholder="Your email..."
          value={email}
          onChange={onChange}
        />
        <LoadingButton
          loading={loading.isOn}
          variant={!isValidEmail(email) ? "outlined" : "contained"}
          disabled={!isValidEmail(email)}
          onClick={onSubmit}
        >
          Unsubscribe
        </LoadingButton>
        {error && (
          <Typography color="error">
            Something went wrong. Please try again.
          </Typography>
        )}
      </Box>
    </Layout>
  );
};

export default UnsubscribedPage;
