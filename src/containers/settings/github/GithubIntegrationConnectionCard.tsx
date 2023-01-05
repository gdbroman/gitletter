import GitHubIcon from "@mui/icons-material/GitHub";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import type { FC } from "react";

const StyledAlert = styled(Alert)`
  .MuiAlert-message {
    width: 100%;
  }
  .MuiAlert-icon {
    display: none;
  }
`;

export const GithubIntegrationConnectionCard: FC = () => (
  <Card variant="outlined">
    <StyledAlert
      severity="info"
      style={{ display: "flex", alignItems: "center" }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={1}
      >
        <Box>
          <AlertTitle style={{ margin: 0 }}>
            GitHub integration required
          </AlertTitle>
          Setup takes less than a minute
        </Box>
        <Button
          variant="contained"
          size="medium"
          color="primary"
          href={process.env.GITHUB_APP_URL}
          startIcon={<GitHubIcon />}
        >
          Connect your repo
        </Button>
      </Box>
    </StyledAlert>
  </Card>
);
