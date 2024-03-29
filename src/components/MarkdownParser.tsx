import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import { useThemeContext } from "../contexts/theme";

type Props = {
  content: string;
};

export const MarkdownParser = ({ content }: Props) => {
  const { theme } = useThemeContext();

  return (
    <ReactMarkdown
      remarkPlugins={[gfm]}
      // eslint-disable-next-line react/no-children-prop
      children={content}
      components={{
        a: (props) => {
          const isTwitter = props.href?.startsWith("https://twitter.com/");

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
              borderLeft: `4px solid ${
                // BUG: Theme is undefined when the email is rendered
                theme ? theme.palette.primary.main : "#000"
              }`,
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
