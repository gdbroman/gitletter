import type { AlertColor, AlertProps } from "@mui/material/Alert";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { forwardRef } from "react";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const CustomSnackbar = ({
  message,
  severity,
  autoHideDuration = 3000,
  isOpen,
  onClose,
}: {
  message: string;
  severity: AlertColor;
  autoHideDuration?: number;
  isOpen: boolean;
  onClose?: () => void;
}) => (
  <Snackbar open={isOpen} onClose={onClose} autoHideDuration={autoHideDuration}>
    <Alert severity={severity} sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);
