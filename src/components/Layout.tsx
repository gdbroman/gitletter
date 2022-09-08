import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { NextSeo } from "next-seo";
import { FC, ReactNode } from "react";

import { siteDescription, siteTagline } from "../../util/constants";
import { Header } from "../containers/header/Header";
import { DynamicMaxWidthWrapper } from "./DynamicMaxWidthWrapper";

const StyledDiv = styled(DynamicMaxWidthWrapper)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  padding-bottom: 16px;
`;

type Props = {
  headerTitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

const Layout: FC<Props> = ({ headerTitle, children, footer }) => (
  <Box display="flex" flexDirection="column" height="100%">
    <NextSeo
      title={`GitLetter · ${siteTagline}`}
      description={siteDescription}
    />
    <Header title={headerTitle} />
    <StyledDiv>{children}</StyledDiv>
    {footer}
  </Box>
);

export default Layout;
