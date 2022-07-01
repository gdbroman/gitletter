import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import { NextSeo } from "next-seo";
import { FC, ReactNode } from "react";

import { shortDescription, siteDescription } from "../../util/constants";
import { Header } from "../containers/header/Header";
import { Footer } from "./Footer";

const maxWidth = 780;
export const maxWidthMinusMargin = maxWidth - 32;

const StyledDiv = styled.div`
  flex: 1;
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
};

const Layout: FC<Props> = (props) => (
  <Box display="flex" flexDirection="column" height="100%">
    <NextSeo
      title={`GitLetter - ${shortDescription}`}
      description={siteDescription}
    />
    <Header />
    <StyledDiv>{props.children}</StyledDiv>
    <Footer />
  </Box>
);

export default Layout;
