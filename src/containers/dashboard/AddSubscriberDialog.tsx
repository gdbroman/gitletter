import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { FC, useMemo, useState } from "react";

import { useToggle } from "../../../util/hooks/useToggle";
import { isValidEmail as isValidEmailFn } from "../../../util/strings";
import { DialogResponsive } from "../../components/DialogResponsive";
import { newsletterService } from "../../services/newsletterService";

type Props = {
  newsletterId: string;
  open: boolean;
  onClose: () => void;
};

export const AddSubscriberDialog: FC<Props> = ({
  newsletterId,
  open,
  onClose,
}) => {
  const router = useRouter();

  const adding = useToggle(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const isValidEmail = useMemo(() => isValidEmailFn(email), [email]);

  const handleSubmit = async () => {
    adding.toggleOn();
    setError(undefined);
    try {
      const res = await newsletterService.subscribe(newsletterId, email);
      if (res) {
        onClose();
        router.replace(router.asPath);
      } else {
        throw new Error();
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      adding.toggleOff();
    }
  };

  return (
    <DialogResponsive open={open} onClose={onClose}>
      <DialogTitle>Manually add subscriber</DialogTitle>
      <DialogContent style={{ overflowY: "visible" }}>
        <TextField
          fullWidth
          label="Email address"
          type="email"
          value={email}
          style={{ marginTop: 8 }}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <Typography variant="caption" color="gray" mt={1}>
          They will not receive a confirmation email.
        </Typography>
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button autoFocus disabled={adding.isOn} onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          loading={adding.isOn}
          variant={isValidEmail ? "contained" : "outlined"}
          disabled={!isValidEmail}
          onClick={handleSubmit}
        >
          Add
        </LoadingButton>
      </DialogActions>
    </DialogResponsive>
  );
};
