import * as Sentry from "@sentry/nextjs";
import NextErrorComponent from "next/error";
import type { NextPage } from "next/types";

type Props = {
  statusCode: number;
};

const CustomErrorPage: NextPage<Props> = ({ statusCode }) => {
  return <NextErrorComponent statusCode={statusCode} />;
};

CustomErrorPage.getInitialProps = async (contextData) => {
  await Sentry.captureUnderscoreErrorException(contextData);

  return NextErrorComponent.getInitialProps(contextData);
};

export default CustomErrorPage;
