import Box from "@mui/material/Box";
import type { FC, ReactNode } from "react";

import { TabsNavBar } from "./TabsNavBar";

export type DashboardProps = {
  children: ReactNode;
};

export const Dashboard: FC<DashboardProps> = ({ children }) => (
  <main>
    <TabsNavBar />
    <Box role="tabpanel" my={3}>
      {children}
    </Box>
  </main>
);
