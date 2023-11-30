import { Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { gitLetterSocialLinks } from "../../util/constants";

const StyledFooter = styled("footer")`
  padding: 16px 64px;
  text-align: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.palette.secondary.light};
`;

export const feedbackCopy = (
  <>
    Questions or feedback? File a{" "}
    <Link href={gitLetterSocialLinks.github} target="_blank">
      GitHub
    </Link>{" "}
    issue.
  </>
);

export const FeedbackFooter = () => (
  <StyledFooter>
    <Typography variant="body2">{feedbackCopy}</Typography>
  </StyledFooter>
);
