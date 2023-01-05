import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import type { GithubIntegration } from "@prisma/client";
import Link from "next/link";
import type { FC } from "react";

import { freeSubscriberLimit } from "../../../util/constants";
import { useAppHref } from "../../../util/hooks/useAppHref";
import { useToggle } from "../../../util/hooks/useToggle";
import { DialogResponsive } from "../../components/DialogResponsive";
import { LoadingButton } from "../../components/LoadingButton";

type Props = {
  subscriberCount: number;
  hasFreeProduct: boolean;
  githubIntegration: GithubIntegration;
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (writeToGithub: boolean) => void;
};

export const SendIssueDialog: FC<Props> = ({
  subscriberCount,
  hasFreeProduct,
  githubIntegration,
  open,
  loading,
  onCancel,
  onSubmit,
}) => {
  const appHref = useAppHref();

  const needsToUpgradePlan =
    subscriberCount > freeSubscriberLimit && hasFreeProduct;
  const emailToAllSubscribers = useToggle(subscriberCount > 0);
  const writeToGithub = useToggle(false);

  const disableSend = needsToUpgradePlan || !emailToAllSubscribers.isOn;

  return (
    <DialogResponsive open={open} onClose={onCancel}>
      {/* Hack to expand the dialog */}
      <Box minWidth="364px" />
      <DialogTitle>Send issue</DialogTitle>
      <DialogContent>
        {needsToUpgradePlan ? (
          <Typography variant="body1" textAlign="center" my={2}>
            You have over {freeSubscriberLimit} subscribers! 🥳
            <Link href={`${appHref}/settings`}>
              Upgrade to the paid plan
            </Link>{" "}
            to send this out.
          </Typography>
        ) : (
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
                  <Link href={`${appHref}/settings/github`}>
                    connected to GitHub
                  </Link>
                  .
                </>
              )}
            </Typography>
          </FormGroup>
        )}
      </DialogContent>
      <DialogActions>
        <Button autoFocus disabled={loading} onClick={onCancel}>
          Cancel
        </Button>
        <LoadingButton
          variant={disableSend ? "outlined" : "contained"}
          loading={loading}
          disabled={disableSend}
          onClick={() => onSubmit(writeToGithub.isOn)}
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </DialogResponsive>
  );
};
