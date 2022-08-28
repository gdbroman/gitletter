import styled from "@emotion/styled";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PeopleIcon from "@mui/icons-material/People";
import SendIcon from "@mui/icons-material/Send";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

import { useAppHref } from "../../../util/hooks/useAppHref";
import { NavBarCta } from "./NavBarCta";

// Style tab with hover effect
const StyledTab = styled(Tab)`
  && {
    height: 30px;
    min-height: 30px;
    margin: 9px 8px 9px 0;
    padding: 0 8px;
    border-radius: 6px;
    &:hover {
      background-color: #eeeeee;
    }
  }
`;

const tabs = {
  "": {
    label: "Drafts",
    icon: <InsertDriveFileIcon />,
  },
  sent: {
    label: "Sent",
    icon: <SendIcon />,
  },
  subscribers: {
    label: "Subscribers",
    icon: <PeopleIcon />,
  },
  settings: {
    label: "Settings",
    icon: <SettingsIcon />,
  },
};

export const NavBar: FC = () => {
  const router = useRouter();
  const appHref = useAppHref();
  const newsletterId = router.query.newsletterId as string;

  const path = router.pathname.split("/")[3] ?? "";

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      <Tabs value={Object.keys(tabs).indexOf(path)} variant="scrollable">
        {Object.entries(tabs).map(([path, { label, icon }]) => (
          <Link href={`${appHref}/${path}`} passHref key={path}>
            <StyledTab
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  {icon}
                  {label}
                </Box>
              }
              {...a11yProps(path)}
            />
          </Link>
        ))}
      </Tabs>
      <NavBarCta newsletterId={newsletterId} />
    </Box>
  );
};

const a11yProps = (path: string) => {
  return {
    id: `dashboard-tab-${path}`,
    "aria-controls": `dashboard-tabpanel-${path}`,
  };
};
