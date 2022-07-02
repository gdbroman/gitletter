import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ChangeEvent, FC, useMemo, useState } from "react";

import { maxEmailAddressLength } from "../../../util/constants";
import { getEmailAddress } from "../../../util/getEmail";
import { useToggle } from "../../../util/hooks/useToggle";
import { CustomSnackbar } from "../../components/Snackbar";
import { newsletterService } from "../../services/newsletterService";

type Props = {
  id: string;
  title: string;
};

export const NewsletterSettings: FC<Props> = ({ id, title: initialTitle }) => {
  const router = useRouter();
  const session = useSession();

  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const submitting = useToggle(false);

  const isValid = useMemo(() => {
    return title.length > 0 && title.length <= maxEmailAddressLength;
  }, [title]);
  const isChanged = useMemo(
    () => title !== initialTitle,
    [title, initialTitle]
  );

  const handleOnChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    if (newName.length <= maxEmailAddressLength) {
      setTitle(newName);
    }
  };
  const handleCancel = () => {
    setTitle(initialTitle);
  };
  const handleSubmit = async () => {
    submitting.toggleOn();
    setError("");
    try {
      const response = await newsletterService.updateNewsletter(
        id,
        title.trim()
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
          label="Title"
          value={title}
          disabled={submitting.isOn}
          onChange={handleOnChangeTitle}
        />
        <Tooltip title="This email address is just for branding purposes.">
          <TextField
            fullWidth
            label="From"
            value={getEmailAddress(title)}
            disabled
          />
        </Tooltip>
        <Tooltip title="Where replies will be sent.">
          <TextField
            fullWidth
            label="Reply-to"
            value={session.data.user.email}
            disabled
          />
        </Tooltip>
        {error && (
          <Typography variant="caption" color="red">
            {error}
          </Typography>
        )}
        <Box display="flex" gap={1} justifyContent="end">
          {isChanged && !success && (
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
            variant={
              isChanged && isValid && !success ? "contained" : "outlined"
            }
            size="medium"
            color="primary"
            disabled={!isChanged || !isValid || !!success}
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