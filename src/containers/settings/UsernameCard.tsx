import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { FC } from "react";

export const UsernameCard: FC = () => (
  <Card variant="outlined">
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="end"
      padding={1}
    >
      <Button
        variant="contained"
        size="medium"
        color="primary"
        href={process.env.GITHUB_APP_URL}
      >
        Save
      </Button>
    </Box>
  </Card>
);
