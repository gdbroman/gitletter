import { FC } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import { useThemeContext } from "../contexts/theme";

type Props = {
  children: string;
};

export const MarkdownParser: FC<Props> = ({ children }) => {
  const { theme } = useThemeContext();

  return (
    <ReactMarkdown
      remarkPlugins={[gfm]}
      children={children}
      components={{
        a: (props) => {
          const isTwitter = props.href.startsWith("https://twitter.com/");

          if (isTwitter) {
            // TODO: build a custom twitter component that is rendered in emails
          }

          return (
            <a href={props.href} target="_blank" rel="noreferrer">
              {props.children}
            </a>
          );
        },
        blockquote: (props) => (
          <blockquote
            style={{
              margin: 0,
              paddingLeft: "2rem",
              borderLeft: `4px solid ${theme.palette.secondary.main}`,
            }}
            {...props}
          >
            {props.children}
          </blockquote>
        ),
      }}
    />
  );
};
