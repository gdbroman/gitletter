import { FC, ReactNode } from "react";

import { NavBar } from "./Navbar";
import { TabPanel } from "./Tabpanel";

type Props = {
  title?: string;
  value: number;
  children: ReactNode;
};

export const Dashboard: FC<Props> = ({ title, value, children }) => (
  <>
    <h1>{title ? title : "Your newsletter"}</h1>
    <NavBar value={value} />
    <main>
      <TabPanel value={value} index={value}>
        {children}
      </TabPanel>
    </main>
  </>
);
