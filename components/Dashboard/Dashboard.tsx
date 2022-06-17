import Box from "@mui/material/Box";
import { FC, ReactNode } from "react";

import { NavBar } from "./NavBar";

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
      <div
        role="tabpanel"
        id={`simple-tabpanel-${value}`}
        aria-labelledby={`simple-tab-${value}`}
      >
        <Box sx={{ p: 3 }}>{children}</Box>
      </div>
    </main>
  </>
);
