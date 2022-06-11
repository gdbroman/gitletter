import { FC, ReactNode } from "react";

import Header from "./Header/Header";

type Props = {
  children: ReactNode;
};

const Layout: FC<Props> = (props) => (
  <div>
    <Header />
    <div className="layout">{props.children}</div>
  </div>
);

export default Layout;
