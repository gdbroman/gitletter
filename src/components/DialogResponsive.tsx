import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import type { Breakpoint } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { ReactNode } from "react";

import { useThemeContext } from "../contexts/theme";

type Props = {
  open: boolean;
  children: ReactNode;
  breakPoint?: Breakpoint;
  onClose: () => void;
};

export const DialogResponsive = ({
  open,
  children,
  breakPoint = "xs",
  onClose,
}: Props) => {
  const { theme } = useThemeContext();
  const fullScreen = useMediaQuery(theme.breakpoints.down(breakPoint));

  return (
    <Dialog
      style={{
        overflowX: "hidden",
      }}
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
    >
      <Box
        padding={1}
        minWidth={fullScreen ? "100%" : "320px"}
        maxWidth={theme.breakpoints.values[breakPoint]}
      >
        {children}
      </Box>
    </Dialog>
  );
};
