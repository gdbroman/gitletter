import styled from "@emotion/styled";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Box, IconButton, Typography } from "@mui/material";
import { FC } from "react";

import { gitLetterSocialLinks } from "../util/constants";
const StyledFooter = styled.footer`
  padding: 16px;
  text-align: center;
  justify-content: center;
`;

export const Footer: FC = () => (
  <StyledFooter>
    <Typography variant="body2" color="secondary">
      Questions, feedback? Reach out on Twitter or Email :)
    </Typography>
    <Box>
      <IconButton href={gitLetterSocialLinks.twitter}>
        <TwitterIcon />
      </IconButton>
      <IconButton href={`mailto:${gitLetterSocialLinks.email}`}>
        <AlternateEmailIcon />
      </IconButton>
    </Box>
  </StyledFooter>
);
