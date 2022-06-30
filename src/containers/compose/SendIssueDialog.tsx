import LoadingButton from "@mui/lab/LoadingButton";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/system/Box";
import { GithubIntegration } from "@prisma/client";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

import theme from "../../../styles/theme";
import { useToggle } from "../../hooks/useToggle";
import { getIntegration } from "../../services/github";

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
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const [githubIntegration, setGithubIntegration] = useState<
    GithubIntegration | undefined
  >();
  const emailToAllSubscribers = useToggle(true);
  const writeToGithub = useToggle(false);

  useEffect(() => {
    const getAndSetIntegration = async () => {
      const resp = await getIntegration(newsletterId);
      if (resp) setGithubIntegration(resp);
    };
    getAndSetIntegration();
  }, [newsletterId]);

  return (
    <Dialog open={open} fullScreen={fullScreen} onClose={onCancel}>
      <Box padding={1}>
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
                  You have not{" "}
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
      </Box>
    </Dialog>
  );
};
