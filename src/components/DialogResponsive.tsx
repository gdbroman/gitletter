import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import { Breakpoint } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FC, ReactNode } from "react";

import { useThemeContext } from "../contexts/theme";

type Props = {
  open: boolean;
  children: ReactNode;
  breakPoint?: Breakpoint;
  onClose: () => void;
};

export const DialogResponsive: FC<Props> = ({
  open,
  children,
  breakPoint = "xs",
  onClose,
}) => {
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
