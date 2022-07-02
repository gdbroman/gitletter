import { FC, ReactNode } from "react";

type Props = {
  title: string;
  content: ReactNode;
};

export const EmailStyleWrapper: FC<Props> = ({ title, content }) => {
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
            <p style={{ display: "inline-block", marginRight: 8 }}>Subscribe</p>
            <p style={{ display: "inline-block" }}>Unsubscribe</p>
          </FooterSection>
          <FooterSection>Powered by GitLetter</FooterSection>
        </footer>
      </div>
    </div>
  );
};

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
