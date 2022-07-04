import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import { NextSeo } from "next-seo";
import { FC, ReactNode } from "react";

import { shortDescription, siteDescription } from "../../util/constants";
import { Header } from "../containers/header/Header";
import { Footer as DefaultFooter } from "./Footer";

const maxWidth = 780;
export const maxWidthMinusMargin = maxWidth - 32;

const StyledDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${maxWidth}px;
  margin: 0 auto;
  padding: 16px 0;
  @media (max-width: ${maxWidthMinusMargin}px) {
    padding: 16px;
  }
`;

type Props = {
  children: ReactNode;
  footer?: ReactNode;
};

const Layout: FC<Props> = ({ children, footer = <DefaultFooter /> }) => (
  <Box display="flex" flexDirection="column" height="100%">
    <NextSeo
      title={`GitLetter - ${shortDescription}`}
      description={siteDescription}
    />
    <Header />
    <StyledDiv>{children}</StyledDiv>
    {footer}
  </Box>
);

export default Layout;
