import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { FC } from "react";
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
  const snippet = [
    `<form method="POST" action="https://gitletter.co/api/${newsletterId}/subscribers">`,
    '  <input type="email" name="email" placeholder="Your email" />',
    "  <button>Subscribe</button>",
    "</form>",
  ].join("\n");

  return (
    <Dialog onClose={onClose} open={open}>
      <Box display="flex" flexDirection="column" gap={4} padding={4} pt={3}>
        <Box textAlign="center">
          <DialogTitle>Signup form</DialogTitle>
          <Typography variant="body2" color="gray" mt={-1} textAlign="center">
            Copy / paste onto your site
          </Typography>
        </Box>
        <Box
          padding={1}
          maxWidth={420}
          style={{
            overflowX: "scroll",
            backgroundColor: "#eee",
            borderRadius: 4,
          }}
        >
          <pre>
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
