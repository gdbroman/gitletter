import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

type Props = {
  emoji: string;
  title: string;
  subtitle: ReactNode;
};

export const EmptyTab = ({ emoji, title, subtitle }: Props) => (
  <Box display="flex" flexDirection="column" gap={2} my={10} textAlign="center">
    <Typography variant="h1">
      <span role="img" aria-label={emoji}>
        {emoji}
      </span>
    </Typography>
    <Typography variant="h4">{title}</Typography>
    <Typography variant="body1">{subtitle}</Typography>
  </Box>
);
