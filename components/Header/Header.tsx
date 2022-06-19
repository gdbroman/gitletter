import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import { FC } from "react";

import { GitLetterLogo } from "./GitLetterLogo";
import { HeaderNavRight } from "./HeaderNavRight";

const StyledHeader = styled.header`
  display: flex;
  padding: 0 16px;
  align-items: center;
`;

const StyledNav = styled.nav`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Header: FC = () => (
  <StyledHeader>
    <StyledNav>
      <Box paddingY={2}>
        <GitLetterLogo />
      </Box>
      <HeaderNavRight />
    </StyledNav>
  </StyledHeader>
);
