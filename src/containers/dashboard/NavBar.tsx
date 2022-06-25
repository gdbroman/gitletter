import AddIcon from "@mui/icons-material/Add";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PeopleIcon from "@mui/icons-material/People";
import SendIcon from "@mui/icons-material/Send";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Link from "next/link";
import { FC } from "react";

import { DashboardProps } from "./Dashboard";

export const NavBar: FC<Pick<DashboardProps, "value" | "newsletterId">> = ({
  value,
  newsletterId,
}) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    sx={{ borderBottom: 1, borderColor: "divider" }}
  >
    <Tabs value={value} aria-label="basic tabs example">
      <Link href="/app" passHref>
        <Tab
          label={
            <Box display="flex" alignItems="center" gap={1}>
              <InsertDriveFileIcon fontSize="small" />
              Drafts
            </Box>
          }
          {...a11yProps(0)}
        />
      </Link>
      <Link href="/app/sent" passHref>
        <Tab
          label={
            <Box display="flex" alignItems="center" gap={1}>
              <SendIcon fontSize="small" />
              Sent
            </Box>
          }
          {...a11yProps(0)}
        />
      </Link>
      <Link href="/app/subscribers" passHref>
        <Tab
          label={
            <Box display="flex" alignItems="center" gap={1}>
              <PeopleIcon fontSize="small" />
              Subscribers
            </Box>
          }
          {...a11yProps(1)}
        />
      </Link>
      <Link href="/app/settings" passHref>
        <Tab
          label={
            <Box display="flex" alignItems="center" gap={1}>
              <SettingsIcon fontSize="small" />
              Settings
            </Box>
          }
          {...a11yProps(2)}
        />
      </Link>
    </Tabs>
    <Link href={`/app/compose?n=${newsletterId}`} passHref>
      <Button variant="contained" color="success" startIcon={<AddIcon />}>
        Compose
      </Button>
    </Link>
  </Box>
);

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};
