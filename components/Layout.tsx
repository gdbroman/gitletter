import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { NextSeo } from "next-seo";
import { FC, ReactNode } from "react";

import { siteDescription, siteTagline, siteTitle } from "../util/constants";
import { Footer } from "./Footer";
import { Header } from "./Header/Header";

const StyledDiv = styled.div`
  flex: 1;
  margin: 16px;
`;

type Props = {
  children: ReactNode;
};

const Layout: FC<Props> = (props) => (
  <Box display="flex" flexDirection="column" height="100%">
    <NextSeo
      title={`${siteTitle} – ${siteTagline}`}
      description={siteDescription}
    />
    <Header />
    <StyledDiv className="layout">{props.children}</StyledDiv>
    <Footer />
  </Box>
);

export default Layout;
