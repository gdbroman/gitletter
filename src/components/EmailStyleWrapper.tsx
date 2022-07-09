import { FC, ReactNode } from "react";

import { siteDomain } from "../../util/constants";

export const emailArticleMaxWidthPxs = 528;

type EmailArticleProps = {
  title: string;
  content: ReactNode;
};

export const EmailArticle: FC<EmailArticleProps> = ({ title, content }) => (
  <article
    style={{
      fontSize: "18px",
      width: "100%",
      maxWidth: `${emailArticleMaxWidthPxs}px`,
      margin: "0 auto",
    }}
  >
    <h1 style={{ fontSize: "32px", textAlign: "center" }}>{title}</h1>
    <hr />
    {content}
  </article>
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
    <div
      style={{
        width: "100%",
        maxWidth: `${emailArticleMaxWidthPxs + 32}px`,
        margin: "32px auto",
        padding: "1rem",
      }}
    >
      <EmailArticle title={title} content={content} />
      {newsletterTitle && emailAddress && (
        <footer style={{ margin: "64px auto 0 auto" }}>
          <FooterSection>
            <p>
              {newsletterTitle} –{" "}
              <UnstyledLink
                href={
                  emailAddress
                    ? `${process.env.APP_URL}/api/newsletter/${newsletterId}/unsubscribe?email=${emailAddress}`
                    : "#"
                }
              >
                Unsubscribe
              </UnstyledLink>
            </p>
          </FooterSection>
          <FooterSection>
            <p>
              Powered by{" "}
              <UnstyledLink href={`https://${siteDomain}`}>
                GitLetter
              </UnstyledLink>
            </p>
          </FooterSection>
        </footer>
      )}
    </div>
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
  <div
    style={{
      textAlign: "center",
      fontSize: "12px",
    }}
  >
    {children}
  </div>
);
