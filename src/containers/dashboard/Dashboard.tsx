import Box from "@mui/material/Box";
import { FC, ReactNode } from "react";

import { NavBar } from "./NavBar";

export type DashboardProps = {
  title: string;
  children: ReactNode;
};

export const Dashboard: FC<DashboardProps> = ({ title, children }) => (
  <main>
    <h1>{title}</h1>
    <NavBar />
    <Box role="tabpanel" my={3}>
      {children}
    </Box>
  </main>
);
