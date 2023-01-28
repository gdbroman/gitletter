import Box from "@mui/material/Box";
import type { ReactNode } from "react";

import { TabsNavBar } from "./TabsNavBar";

export type DashboardProps = {
  children: ReactNode;
};

export const Dashboard = ({ children }: DashboardProps) => (
  <main>
    <TabsNavBar />
    <Box role="tabpanel" my={3}>
      {children}
    </Box>
  </main>
);
