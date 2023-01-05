import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import type { ReactNode } from "react";

import { useThemeContext } from "../../contexts/theme";
import { SideSettingsMenu } from "./SideSettingsMenu";

export const SettingsContentWrapper = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { theme } = useThemeContext();
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
