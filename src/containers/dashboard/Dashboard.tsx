import Box from "@mui/material/Box";
import { FC, ReactNode } from "react";

import { NavBar } from "./NavBar";

export type DashboardProps = {
  title?: string;
  value: number;
  newsletterId: string;
  children: ReactNode;
};

export const Dashboard: FC<DashboardProps> = ({
  title,
  value,
  newsletterId,
  children,
}) => (
  <main>
    <h1>{title ? title : "Your newsletter"}</h1>
    <NavBar value={value} newsletterId={newsletterId} />
    <div
      role="tabpanel"
      id={`simple-tabpanel-${value}`}
      aria-labelledby={`simple-tab-${value}`}
    >
      <Box my={3}>{children}</Box>
    </div>
  </main>
);
