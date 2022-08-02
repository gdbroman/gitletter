import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PeopleIcon from "@mui/icons-material/People";
import SendIcon from "@mui/icons-material/Send";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Link from "next/link";
import { FC } from "react";

import { useAppHref } from "../../../util/hooks/useAppHref";
import { DashboardProps } from "./Dashboard";
import { NavBarCta } from "./NavBarCta";

export const NavBar: FC<Pick<DashboardProps, "value" | "newsletterId">> = ({
  value,
  newsletterId,
}) => {
  const appHref = useAppHref();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      <Tabs value={value} variant="scrollable" scrollButtons="auto">
        <Link href={appHref} passHref>
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
        <Link href={`${appHref}/sent`} passHref>
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
        <Link href={`${appHref}/subscribers`} passHref>
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
        <Link href={`${appHref}/settings`} passHref>
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
      <NavBarCta newsletterId={newsletterId} />
    </Box>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};
