import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { GithubIntegration } from "@prisma/client";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

import { DialogResponsive } from "../../components/DialogResponsive";
import { useToggle } from "../../hooks/useToggle";
import { getIntegration } from "../../services/github";
import { getSubscriberCount } from "../../services/subscribers";

type Props = {
  newsletterId: string;
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (writeToGithub: boolean) => void;
};

export const SendIssueDialog: FC<Props> = ({
  newsletterId,
  open,
  loading,
  onCancel,
  onSubmit,
}) => {
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [githubIntegration, setGithubIntegration] = useState<
    GithubIntegration | undefined
  >();

  const emailToAllSubscribers = useToggle(true);
  const writeToGithub = useToggle(false);

  useEffect(() => {
    const getAndSet = async () => {
      const integrationRes = await getIntegration(newsletterId);
      if (integrationRes) setGithubIntegration(integrationRes);
      const subscriberCountRes = await getSubscriberCount(newsletterId);
      if (subscriberCountRes) setSubscriberCount(subscriberCountRes);
    };
    getAndSet();
  }, [newsletterId]);

  return (
    <DialogResponsive open={open} onClose={onCancel}>
      {/* Hack to expand the dialog */}
      <Box minWidth="364px" />
      <DialogTitle>Send issue</DialogTitle>
      <DialogContent>
        <FormGroup>
          <FormControlLabel
            label="Email to all subscribers"
            control={
              <Checkbox
                required
                checked={emailToAllSubscribers.isOn}
                onClick={emailToAllSubscribers.toggle}
              />
            }
          />
          <Typography variant="caption" color="gray">
            You currently have {subscriberCount} subscribers.
          </Typography>
          <FormControlLabel
            disabled={!githubIntegration}
            label="Write to GitHub"
            control={
              <Checkbox
                checked={writeToGithub.isOn}
                onClick={writeToGithub.toggle}
              />
            }
          />
          <Typography variant="caption" color="gray">
            {!!githubIntegration ? (
              `Will be saved to ${
                !githubIntegration.repoDir ? "./" : githubIntegration.repoDir
              } in ${githubIntegration.repoOwner}/${
                githubIntegration.repoName
              }.`
            ) : (
              <>
                You are not{" "}
                <Link href="/app/settings">connected to GitHub</Link> in
                settings.
              </>
            )}
          </Typography>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus disabled={loading} onClick={onCancel}>
          Cancel
        </Button>
        <LoadingButton
          variant={emailToAllSubscribers.isOn ? "contained" : "outlined"}
          loading={loading}
          disabled={!emailToAllSubscribers.isOn}
          onClick={() => onSubmit(writeToGithub.isOn)}
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </DialogResponsive>
  );
};
