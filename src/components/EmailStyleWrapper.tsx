import { FC, ReactNode } from "react";

import { siteDomain } from "../../util/constants";

type Props = {
  title: string;
  content: ReactNode;
  newsletterId: string;
  emailAddress?: string;
};

export const EmailStyleWrapper: FC<Props> = ({
  title,
  content,
  newsletterId,
  emailAddress,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#F9F5EC",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "32px auto",
          padding: "1rem",
        }}
      >
        <article
          style={{
            fontSize: "18px",
            width: "100%",
          }}
        >
          <h1 style={{ textAlign: "center" }}>{title}</h1>
          <hr />
          {content}
        </article>
        <footer style={{ margin: "32px auto" }}>
          <FooterSection>
            <p>
              <UnstyledLink
                href={
                  emailAddress
                    ? `https://${siteDomain}/api/newsletter/${newsletterId}/subscribe?email=${emailAddress}`
                    : "#"
                }
              >
                Subscribe
              </UnstyledLink>
              {" / "}
              <UnstyledLink
                href={
                  emailAddress
                    ? `https://${siteDomain}/api/newsletter/${newsletterId}/unsubscribe?email=${emailAddress}`
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
      </div>
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
