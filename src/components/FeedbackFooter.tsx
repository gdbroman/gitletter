import { Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { FC } from "react";

import { gitLetterSocialLinks } from "../../util/constants";

const StyledFooter = styled("footer")`
  padding: 16px 64px;
  text-align: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.palette.secondary.light};
`;

export const feedbackCopy = (
  <>
    Questions or feedback? Reach out on{" "}
    <Link href={gitLetterSocialLinks.twitter} target="_blank" color="secondary">
      Twitter
    </Link>{" "}
    or{" "}
    <Link
      href={`mailto:${gitLetterSocialLinks.email}?subject=GitLetter question`}
      target="_blank"
      color="secondary"
    >
      email
    </Link>
    .
  </>
);

export const FeedbackFooter: FC = () => (
  <StyledFooter>
    <Typography variant="body2" color="secondary">
      {feedbackCopy}
    </Typography>
  </StyledFooter>
);
