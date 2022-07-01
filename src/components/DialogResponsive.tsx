import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import { Breakpoint } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FC, ReactNode } from "react";

import theme from "../../styles/theme";

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
  const fullScreen = useMediaQuery(theme.breakpoints.down(breakPoint));

  return (
    <Dialog
      style={{ overflowX: "hidden" }}
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
    >
      <Box padding={1} maxWidth={theme.breakpoints.values[breakPoint]}>
        {children}
      </Box>
    </Dialog>
  );
};
