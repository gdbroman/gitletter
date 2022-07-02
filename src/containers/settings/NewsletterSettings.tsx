import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { ChangeEvent, FC, useMemo, useState } from "react";

import { maxEmailAddressLength } from "../../../util/constants";
import { getEmailAddress } from "../../../util/getEmail";
import { useToggle } from "../../../util/hooks/useToggle";
import { CustomSnackbar } from "../../components/Snackbar";
import { newsletterService } from "../../services/newsletterService";

type Props = {
  id: string;
  name: string;
};

export const NewsletterSettings: FC<Props> = ({ id, name: initialName }) => {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const submitting = useToggle(false);

  const isValid = useMemo(() => {
    return name.length > 0 && name.length <= maxEmailAddressLength;
  }, [name]);
  const isChanged = useMemo(() => name !== initialName, [name, initialName]);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    if (newName.length <= maxEmailAddressLength) {
      setName(newName);
    }
  };
  const handleCancel = () => {
    setName(initialName);
  };
  const handleSubmit = async () => {
    submitting.toggleOn();
    setError("");
    try {
      const response = await newsletterService.updateNewsletter(
        id,
        name.trim()
      );
      if (!response) {
        throw new Error();
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      submitting.toggleOff();
      setSuccess("Newsletter updated!");
      router.replace(`/app/settings`);
    }
  };

  return (
    <Card variant="outlined">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        padding={2}
        paddingTop={4}
        gap={2}
      >
        <TextField
          fullWidth
          label="Name"
          value={name}
          disabled={submitting.isOn}
          onChange={handleOnChange}
        />
        <TextField
          fullWidth
          label="Email address"
          value={getEmailAddress(name)}
          disabled
        />
        {/* <TextField fullWidth label="Reply-to" value={session.data.user.email} /> */}
        {error && (
          <Typography variant="caption" color="red">
            {error}
          </Typography>
        )}
        <Box display="flex" gap={1} justifyContent="end">
          {isChanged && (
            <Button
              variant="text"
              size="medium"
              color="primary"
              disabled={submitting.isOn}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
          <LoadingButton
            variant={isChanged && isValid ? "contained" : "outlined"}
            size="medium"
            color="primary"
            disabled={!isChanged || !isValid}
            loading={submitting.isOn}
            onClick={handleSubmit}
          >
            Save
          </LoadingButton>
        </Box>
      </Box>
      <CustomSnackbar
        message={success}
        severity="success"
        isOpen={!!success}
        onClose={() => setSuccess(undefined)}
      />
    </Card>
  );
};
