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
import { FC } from "react";

import { useAppHref } from "../../../util/hooks/useAppHref";
import { useToggle } from "../../../util/hooks/useToggle";
import { DialogResponsive } from "../../components/DialogResponsive";

type Props = {
  subscriberCount: number;
  githubIntegration: GithubIntegration;
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (writeToGithub: boolean) => void;
};

export const SendIssueDialog: FC<Props> = ({
  subscriberCount,
  githubIntegration,
  open,
  loading,
  onCancel,
  onSubmit,
}) => {
  const appHref = useAppHref();

  const emailToAllSubscribers = useToggle(subscriberCount > 0);
  const writeToGithub = useToggle(false);

  return (
    <DialogResponsive open={open} onClose={onCancel}>
      {/* Hack to expand the dialog */}
      <Box minWidth="364px" />
      <DialogTitle>Send issue</DialogTitle>
      <DialogContent>
        <FormGroup>
          <FormControlLabel
            disabled={subscriberCount === 0}
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
            The issue will be sent to{" "}
            <Link href={`${appHref}/subscribers`}>
              {`${subscriberCount} subscriber${
                subscriberCount === 1 ? "" : "s"
              }`}
            </Link>
            .
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
          <Typography variant="caption" color="gray" mb={1}>
            {!!githubIntegration ? (
              <>
                The issue will be saved to{" "}
                <Typography fontWeight={600} variant="caption" color="gray">
                  {!githubIntegration.repoDir
                    ? "./"
                    : githubIntegration.repoDir}
                </Typography>{" "}
                in{" "}
                <Typography fontWeight={600} variant="caption" color="gray">
                  {githubIntegration.repoOwner}/{githubIntegration.repoName}
                </Typography>
                .
              </>
            ) : (
              <>
                You are not{" "}
                <Link href={`${appHref}/settings`}>connected to GitHub</Link>.
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
