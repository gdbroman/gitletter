import { FC } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

type Props = {
  children: string;
};

export const MarkdownParser: FC<Props> = ({ children }) => (
  <ReactMarkdown remarkPlugins={[gfm]} children={children} />
);
