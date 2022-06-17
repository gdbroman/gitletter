import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Link from "next/link";

export const NavBar = ({ value }) => (
  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
    <Tabs value={value} aria-label="basic tabs example">
      <Link href="/app" passHref>
        <Tab label="Publish" {...a11yProps(0)} />
      </Link>
      <Link href="/app/capture" passHref>
        <Tab label="Capture" {...a11yProps(1)} />
      </Link>
      <Link href="/app/settings" passHref>
        <Tab label="Settings" {...a11yProps(2)} />
      </Link>
    </Tabs>
  </Box>
);

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};
