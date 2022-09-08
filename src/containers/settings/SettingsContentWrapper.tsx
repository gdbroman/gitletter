import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

import { SideSettingsMenu } from "./SideSettingsMenu";

export const SettingsContentWrapper = ({ children }) => {
  const theme = useTheme();
  const breakpoint = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box display="flex" flexDirection={breakpoint ? "column" : "row"} gap={2}>
      <SideSettingsMenu />
      <Box flex={1} display="flex" flexDirection="column" gap={2}>
        {children}
      </Box>
    </Box>
  );
};
