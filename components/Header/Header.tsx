import styled from "@emotion/styled";
import Box from "@mui/system/Box";
import { FC } from "react";

import { GitLetterLogo } from "./GitLetterLogo";
import { HeaderNavRight } from "./HeaderNavRight";

const StyledHeader = styled.header`
  display: flex;
  padding: 8px;
  height: 64px;
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
      <Box display="flex" ml={1}>
        <GitLetterLogo />
      </Box>
      <HeaderNavRight />
    </StyledNav>
  </StyledHeader>
);
