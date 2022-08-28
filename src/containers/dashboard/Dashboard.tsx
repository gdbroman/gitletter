import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FC, ReactNode } from "react";

import { TabsNavBar } from "./TabsNavBar";

export type DashboardProps = {
  title: string;
  children: ReactNode;
};

export const Dashboard: FC<DashboardProps> = ({ title, children }) => (
  <main>
    <Typography variant="h3" fontWeight={700} mb={3} mt={4}>
      {title}
    </Typography>
    <TabsNavBar />
    <Box role="tabpanel" my={3}>
      {children}
    </Box>
  </main>
);
