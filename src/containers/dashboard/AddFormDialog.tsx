import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import copy from "copy-to-clipboard";
import { FC } from "react";

import { useToggle } from "../../../util/hooks/useToggle";
import { DialogResponsive } from "../../components/DialogResponsive";
import { useThemeContext } from "../../contexts/theme";
type Props = {
  newsletterId: string;
  open: boolean;
  onClose: () => void;
};

export const AddFormDialog: FC<Props> = ({ newsletterId, open, onClose }) => {
  const { theme } = useThemeContext();
  const copied = useToggle(false);
  const snippet = [
    `<form method="POST" action="https://gitletter.co/api/newsletter/${newsletterId}/subscribe">`,
    '  <input type="email" name="email" placeholder="Your email address..." />',
    "  <button>Subscribe</button>",
    "</form>",
  ].join("\n");

  const handleCopy = () => {
    copy(snippet);
    copied.toggleOn();
  };

  return (
    <DialogResponsive breakPoint="md" onClose={onClose} open={open}>
      <Box display="flex" flexDirection="column" gap={4} padding={4} pt={3}>
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          style={{ userSelect: "none" }}
        >
          Signup form
        </Typography>
        <Box
          maxWidth={theme.breakpoints.down("xs")}
          style={{
            position: "relative",
            backgroundColor: theme.palette.secondary.light,
            borderRadius: 4,
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding={1}
          >
            <Typography
              variant="body2"
              color="gray"
              style={{ userSelect: "none" }}
            >
              Copy / paste this onto your blog
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
    </DialogResponsive>
  );
};
