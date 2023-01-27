import type { AlertColor, AlertProps } from "@mui/material/Alert";
import MuiAlert from "@mui/material/Alert";
import MuiSnackbar from "@mui/material/Snackbar";
import { forwardRef } from "react";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export type SnackbarProps = {
  message: string;
  severity: AlertColor;
  autoHideDuration?: number;
  isOpen: boolean;
  onClose?: () => void;
};

export const Snackbar = ({
  message,
  severity,
  autoHideDuration = 3000,
  isOpen,
  onClose,
}: SnackbarProps) => (
  <MuiSnackbar
    open={isOpen}
    onClose={onClose}
    autoHideDuration={autoHideDuration}
  >
    <Alert severity={severity} sx={{ width: "100%" }}>
      {message}
    </Alert>
  </MuiSnackbar>
);
