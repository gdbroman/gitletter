import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import { Breakpoint, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FC, ReactNode } from "react";

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
  const theme = useTheme();
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
