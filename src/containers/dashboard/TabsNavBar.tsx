import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PeopleIcon from "@mui/icons-material/People";
import SendIcon from "@mui/icons-material/Send";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

import { useAppHref } from "../../../util/hooks/useAppHref";
import { useThemeContext } from "../../contexts/theme";
import { TabsNavBarCta } from "./TabsNavBarCta";

// Style tab with hover effect
const StyledTab = styled(Tab)`
  && {
    box-sizing: border-box;
    height: 40px;
    padding: 12px 0;
    .MuiBox-root {
      padding: 8px 12px;
      border-radius: 6px;
    }
    &:hover {
      .MuiBox-root {
        background-color: ${({ theme }) => theme.palette.primary.light};
      }
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

export const TabsNavBar: FC = () => {
  const router = useRouter();
  const appHref = useAppHref();
  const { theme } = useThemeContext();

  const newsletterId = router.query.newsletterId as string;
  const currentPath = router.pathname.split("/")[3] ?? "";

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Tabs
          value={Object.keys(tabs).indexOf(currentPath)}
          variant="scrollable"
          scrollButtons={false}
          TabIndicatorProps={{
            style: {
              backgroundColor: theme.palette.secondary.light,
            },
          }}
        >
          {Object.entries(tabs).map(([path, { label, icon }]) => (
            <Link href={`${appHref}/${path}`} passHref key={path}>
              <StyledTab
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    {icon}
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      lineHeight="24px"
                      style={{
                        opacity: path === currentPath ? 1 : 0.6,
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                }
                disableRipple
                {...a11yProps(path)}
              />
            </Link>
          ))}
        </Tabs>
        <TabsNavBarCta newsletterId={newsletterId} />
      </Box>
      <Divider />
    </>
  );
};

const a11yProps = (path: string) => {
  return {
    id: `dashboard-tab-${path}`,
    "aria-controls": `dashboard-tabpanel-${path}`,
  };
};
