import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { FC } from "react";

import { ItemSelect } from "../../../components/ItemSelect";
import {
  LoadingButton,
  LoadingButtonWithBlackSpinner,
} from "../../../components/LoadingButton";
import { CustomSnackbar } from "../../../components/Snackbar";

type GithubIntegrationSettingsCardProps = {
  repo: string;
  repos: string[];
  dir: string;
  dirs: string[];
  isValid: boolean;
  isChanged: boolean;
  submitting: boolean;
  disconnecting: boolean;
  error: string | null;
  success: string | null;
  setRepo: (repo: string) => void;
  setDir: (dir: string) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  handleSave: () => void;
  handleCancelEdit: () => void;
  handleDisconnect: () => void;
};

export const GithubIntegrationSettingsCard: FC<
  GithubIntegrationSettingsCardProps
> = ({
  repo,
  repos,
  dir,
  dirs,
  isValid,
  isChanged,
  submitting,
  disconnecting,
  error,
  success,
  setRepo,
  setDir,
  setError,
  setSuccess,
  handleSave,
  handleCancelEdit,
  handleDisconnect,
}) => (
  <>
    <CustomSnackbar
      message={success}
      severity="success"
      isOpen={!!success}
      onClose={() => setSuccess(null)}
    />
    <CustomSnackbar
      message={error}
      severity="error"
      autoHideDuration={6000}
      isOpen={!!error}
      onClose={() => setError(null)}
    />
    <Card variant="outlined">
      <Alert
        severity="success"
        onClose={handleDisconnect}
        closeText={"Disconnect from GitHub"}
      >
        Connected to GitHub!
      </Alert>
      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        padding={2}
        paddingTop={4}
      >
        <ItemSelect
          label="Repository"
          items={repos}
          value={repo}
          onChange={setRepo}
          helperText="Select a repository."
          disabled={submitting || disconnecting}
          required
        />
        {repo && (
          <Box marginBottom={1}>
            <ItemSelect
              label="Directory"
              items={dirs}
              value={dir}
              onChange={setDir}
              helperText={"Select a directory to deploy your issues."}
              disabled={submitting || disconnecting}
              required
            />
          </Box>
        )}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption">
            Can't find your repository?{" "}
            <Link
              href={process.env.GITHUB_APP_URL}
              target="_blank"
              rel="noreferrer"
            >
              Add it
            </Link>{" "}
            to your installation configuration.
          </Typography>
          <Box display="flex" columnGap={1}>
            {submitting && (
              <LoadingButton variant="contained" loading>
                Save
              </LoadingButton>
            )}
            {disconnecting && (
              <LoadingButtonWithBlackSpinner variant="outlined" loading>
                Save
              </LoadingButtonWithBlackSpinner>
            )}
            {!(submitting || disconnecting) && (
              <>
                {isChanged && !success && (
                  <Button variant="text" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                )}
                <Button
                  variant={!isValid || !!success ? "outlined" : "contained"}
                  disabled={!isValid || !!success}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  </>
);
