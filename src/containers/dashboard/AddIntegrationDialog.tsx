import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import copy from "copy-to-clipboard";
import { FC } from "react";

import theme from "../../../styles/theme";
import { useToggle } from "../../hooks/useToggle";
type Props = {
  newsletterId: string;
  open: boolean;
  onClose: () => void;
};

export const AddIntegrationDialog: FC<Props> = ({
  newsletterId,
  open,
  onClose,
}) => {
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const copied = useToggle(false);
  const snippet = [
    `<form method="POST" action="https://gitletter.co/api/${newsletterId}/subscribers">`,
    '  <input type="email" name="email" placeholder="Your email address..." />',
    "  <button>Subscribe</button>",
    "</form>",
  ].join("\n");

  const handleCopy = () => {
    copy(snippet);
    copied.toggleOn();
  };

  return (
    <Dialog onClose={onClose} open={open} fullScreen={fullScreen}>
      <Box display="flex" flexDirection="column" gap={4} padding={4} pt={3}>
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          Signup form
        </Typography>
        <Box
          maxWidth={theme.breakpoints.down("xs")}
          style={{
            position: "relative",
            backgroundColor: "#eee",
            borderRadius: 4,
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding={1}
          >
            <Typography variant="body2" color="gray">
              Copy / paste this onto your site
            </Typography>
            <Tooltip title={copied.isOn ? "Copied!" : "Copy to clipboard"}>
              <IconButton onClick={handleCopy}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <pre
            style={{
              overflowX: "scroll",
              margin: 0,
              padding: "8px 16px 16px 16px",
            }}
          >
            <code className="js">{snippet}</code>
          </pre>
        </Box>
        <Button variant="contained" endIcon={<CheckIcon />} onClick={onClose}>
          Done
        </Button>
      </Box>
    </Dialog>
  );
};
