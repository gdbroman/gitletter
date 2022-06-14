import styled from "@emotion/styled";
import { FC } from "react";

import { GitLetterLogo } from "./GitLetterLogo";
import { HeaderNavRight } from "./HeaderNavRight";

const StyledHeader = styled.header`
  display: flex;
  height: 70px;
  padding: 0 16px;
  align-items: center;
`;

const StyledNav = styled.nav`
  flex: 1;
  display: flex;
  justify-content: space-between;
`;

export const Header: FC = () => (
  <StyledHeader>
    <StyledNav>
      <GitLetterLogo />
      <HeaderNavRight />
    </StyledNav>
  </StyledHeader>
);
