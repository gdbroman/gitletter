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
    <Link href={gitLetterSocialLinks.twitter} target="_blank">
      Twitter
    </Link>{" "}
    or file a{" "}
    <Link href={gitLetterSocialLinks.github} target="_blank">
      GitHub
    </Link>{" "}
    issue.
  </>
);

export const FeedbackFooter: FC = () => (
  <StyledFooter>
    <Typography variant="body2">{feedbackCopy}</Typography>
  </StyledFooter>
);
