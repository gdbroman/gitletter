import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useCallback, useMemo, useState } from "react";

import { useToggle } from "../../../util/hooks/useToggle";
import { DialogResponsive } from "../../components/DialogResponsive";
import { LoadingButton } from "../../components/LoadingButton";
import { issueService } from "../../services/issueService";

type Props = {
  issueId: string;
  defaultEmailAddress: string;
  open: boolean;
  onClose: () => void;
};

export const SendTestEmailDialog = ({
  issueId,
  defaultEmailAddress,
  open,
  onClose,
}: Props) => {
  const sending = useToggle(false);
  const [email, setEmail] = useState<string>(defaultEmailAddress);
  const isEmailValid = useMemo(() => {
    if (!email) {
      return false;
    }
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  }, [email]);

  const sendTestEmail = useCallback(async () => {
    sending.toggleOn();
    try {
      await issueService.sendTestEmail(issueId, email);
    } catch (error) {
      console.error(error);
    } finally {
      sending.toggleOff();
      onClose();
    }
  }, [email, issueId, sending, onClose]);

  return (
    <DialogResponsive open={open} onClose={onClose}>
      <DialogTitle>Send a test email</DialogTitle>
      <DialogContent style={{ overflowY: "visible" }}>
        <TextField
          fullWidth
          label="Email address"
          type="email"
          value={email}
          style={{ marginTop: 8 }}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus disabled={sending.isOn} onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          loading={sending.isOn}
          variant={isEmailValid ? "contained" : "outlined"}
          disabled={!isEmailValid}
          onClick={sendTestEmail}
        >
          Send
        </LoadingButton>
      </DialogActions>
    </DialogResponsive>
  );
};
