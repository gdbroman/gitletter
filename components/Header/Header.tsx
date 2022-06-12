import styled from "@emotion/styled";
import { FC } from "react";

import { GitLetterLogo } from "./GitLetterLogo";
import { HeaderNavRight } from "./HeaderNavRight";

const StyledHeader = styled.header`
  display: flex;
  padding: 16px;
  align-items: center;
  justify-content: space-between;
`;

export const Header: FC = () => (
  <StyledHeader>
    <GitLetterLogo />
    <HeaderNavRight />
  </StyledHeader>
);
