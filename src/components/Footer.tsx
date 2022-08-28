import styled from "@emotion/styled";
import { Link } from "@mui/material";
import Typography from "@mui/material/Typography";
import { FC } from "react";

import { gitLetterSocialLinks } from "../../util/constants";

const StyledFooter = styled.footer`
  padding: 16px 64px;
  text-align: center;
  justify-content: center;
  background-color: #eeeeee;
`;

export const Footer: FC = () => (
  <StyledFooter>
    <Typography variant="body2" color="secondary">
      Questions or feedback? Reach out on{" "}
      <Link href={gitLetterSocialLinks.twitter} target="_blank">
        Twitter
      </Link>{" "}
      or{" "}
      <Link
        href={`mailto:${gitLetterSocialLinks.email}?subject=GitLetter question`}
        target="_blank"
      >
        email
      </Link>
      .
    </Typography>
  </StyledFooter>
);
