import { NextSeo } from "next-seo";
import { FC, ReactNode } from "react";

import Header from "./Header/Header";

type Props = {
  children: ReactNode;
};

const Layout: FC<Props> = (props) => (
  <div>
    <NextSeo
      title="GitLetter – Start a newsletter using GitHub"
      description="Start a newsletter using GitHub"
    />
    <Header />
    <div className="layout">{props.children}</div>
  </div>
);

export default Layout;
