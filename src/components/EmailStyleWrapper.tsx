import { FC, ReactNode } from "react";

import { siteDomain } from "../../util/constants";

const emailArticleMaxWidthPxs = 560;

type EmailArticleProps = {
  title: string;
  content: ReactNode;
};

export const EmailArticle: FC<EmailArticleProps> = ({ title, content }) => (
  <td
    style={{
      fontSize: "18px",
      width: "100%",
      maxWidth: `${emailArticleMaxWidthPxs}px`,
      margin: "0 auto",
    }}
  >
    <h1 style={{ margin: "64px 0 0 0", fontSize: "32px", textAlign: "center" }}>
      {title}
    </h1>
    <hr style={{ margin: "32px 0" }} />
    {content}
  </td>
);

type EmailStyleWrapperProps = EmailArticleProps & {
  newsletterId: string;
  newsletterTitle?: string;
  emailAddress?: string;
};

export const EmailStyleWrapper: FC<EmailStyleWrapperProps> = ({
  title,
  content,
  newsletterId,
  newsletterTitle,
  emailAddress,
}) => {
  return (
    <table
      style={{
        width: "100%",
        maxWidth: `${emailArticleMaxWidthPxs}px`,
        margin: "0 auto",
      }}
    >
      <tr>
        <EmailArticle title={title} content={content} />
      </tr>
      {newsletterTitle && emailAddress && (
        <tr>
          <table style={{ margin: "46px auto 0 auto" }}>
            <FooterSection>
              <p style={{ margin: 0 }}>
                {newsletterTitle} –{" "}
                <UnstyledLink
                  href={
                    emailAddress
                      ? `${process.env.APP_URL}/app/${newsletterId}/unsubscribe?email=${emailAddress}`
                      : "#"
                  }
                >
                  Unsubscribe
                </UnstyledLink>
              </p>
            </FooterSection>
            <FooterSection>
              <p style={{ margin: "8px 0 0 0" }}>
                Powered by{" "}
                <UnstyledLink href={`https://${siteDomain}`}>
                  GitLetter
                </UnstyledLink>
              </p>
            </FooterSection>
          </table>
        </tr>
      )}
    </table>
  );
};

const UnstyledLink = ({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: "unset",
      textDecoration: "none",
    }}
  >
    {children}
  </a>
);

const FooterSection = ({ children }) => (
  <tr
    style={{
      textAlign: "center",
      fontSize: "12px",
    }}
  >
    {children}
  </tr>
);
