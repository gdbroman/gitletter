import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { FC, useMemo, useState } from "react";

import { addSubscriber } from "../../services/subscribers";

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

  const [email, setEmail] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const isEmailValid = useMemo(() => {
    if (!email) {
      return false;
    }
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  }, [email]);

  const handleSubmit = async () => {
    setError(undefined);
    try {
      const res = await addSubscriber(email, newsletterId);
      if (res.status > 299) {
        throw new Error(await res.text());
      } else {
        onClose();
        router.replace(router.asPath);
      }
    } catch (error) {
      if (error.message) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <IconButton onClick={onClose} style={{ position: "absolute", right: 0 }}>
        <CloseIcon />
      </IconButton>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        padding={4}
        pt={3}
      >
        <DialogTitle>Manually add a subscriber</DialogTitle>
        <Box width="300px">
          <TextField
            fullWidth
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <Typography variant="body2" color="gray" mt={1}>
            We will not send a confirmation email.
          </Typography>
        </Box>
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
        <Button
          fullWidth
          size="large"
          color="primary"
          variant={isEmailValid ? "contained" : "outlined"}
          disabled={!isEmailValid}
          onClick={handleSubmit}
        >
          Add subscriber
        </Button>
      </Box>
    </Dialog>
  );
};
