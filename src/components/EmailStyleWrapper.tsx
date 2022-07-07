import { FC, ReactNode } from "react";

import { siteDomain } from "../../util/constants";

type Props = {
  title: string;
  content: ReactNode;
  newsletterId: string;
  newsletterTitle?: string;
  emailAddress?: string;
};

export const EmailStyleWrapper: FC<Props> = ({
  title,
  content,
  newsletterId,
  newsletterTitle,
  emailAddress,
}) => {
  return (
    <div
      style={{
        maxWidth: "560px",
        width: "100%",
        margin: "32px auto",
        padding: "1rem",
      }}
    >
      <article
        style={{
          fontSize: "18px",
        }}
      >
        <h1 style={{ fontSize: "32px", textAlign: "center" }}>{title}</h1>
        <hr />
        {content}
      </article>
      {newsletterTitle && emailAddress && (
        <footer style={{ margin: "32px auto" }}>
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
