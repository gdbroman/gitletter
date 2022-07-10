import { FC } from "react";
import ReactMarkdown from "react-markdown";
import { TwitterTweetEmbed } from "react-twitter-embed";
import gfm from "remark-gfm";

type Props = {
  children: string;
};

export const MarkdownParser: FC<Props> = ({ children }) => (
  <ReactMarkdown
    remarkPlugins={[gfm]}
    children={children}
    components={{
      a: (props) => {
        const isTwitter = props.href.startsWith("https://twitter.com/");

        if (isTwitter) {
          const tweetId = props.href.split("/")[5];

          console.log("tweetId", tweetId);

          return <TwitterTweetEmbed tweetId={tweetId} />;
        }

        return (
          <a href={props.href} target="_blank" rel="noreferrer">
            {props.children}
          </a>
        );
      },
    }}
  />
);
