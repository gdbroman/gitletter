import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { FC, useMemo, useState } from "react";

import { DialogResponsive } from "../../components/DialogResponsive";
import { useToggle } from "../../hooks/useToggle";
import { subscriberService } from "../../services/subscriberService";

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
  const [email, setEmail] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const isEmailValid = useMemo(() => {
    if (!email) {
      return false;
    }
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  }, [email]);

  const handleSubmit = async () => {
    adding.toggleOn();
    setError(undefined);
    try {
      const res = await subscriberService.createSubscriber(email, newsletterId);
      console.log(res);
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
          We will not send them a confirmation email.
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
          variant={isEmailValid ? "contained" : "outlined"}
          disabled={!isEmailValid}
          onClick={handleSubmit}
        >
          Add subscriber
        </LoadingButton>
      </DialogActions>
    </DialogResponsive>
  );
};
