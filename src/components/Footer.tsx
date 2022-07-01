import styled from "@emotion/styled";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import TwitterIcon from "@mui/icons-material/Twitter";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { FC } from "react";

import { gitLetterSocialLinks } from "../../util/constants";

const StyledFooter = styled.footer`
  padding: 16px 32px;
  text-align: center;
  justify-content: center;
`;

export const Footer: FC = () => (
  <StyledFooter>
    <Typography variant="body2" color="secondary">
      Questions or feedback? Reach out on Twitter or Email:
    </Typography>
    <Box>
      <IconButton
        href={gitLetterSocialLinks.twitter}
        title="@GitLetterCo on Twitter"
        target="_blank"
      >
        <TwitterIcon />
      </IconButton>
      <IconButton
        href={`mailto:${gitLetterSocialLinks.email}`}
        title="GitLetter email"
        target="_blank"
      >
        <AlternateEmailIcon />
      </IconButton>
    </Box>
  </StyledFooter>
);
