import styled from "@emotion/styled";
import Box from "@mui/system/Box";
import { FC } from "react";

import { GitLetterLogo } from "../../components/GitLetterLogo";
import { HeaderNavRight } from "./HeaderNavRight";

const StyledHeader = styled.header`
  display: flex;
  height: 64px;
  min-height: 64px;
  padding: 8px;
  align-items: center;
`;

const StyledNav = styled.nav`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

type Props = {
  title?: string;
};

export const Header: FC<Props> = ({ title }) => (
  <StyledHeader>
    <StyledNav>
      <Box display="flex" ml={1}>
        <GitLetterLogo title={title} />
      </Box>
      <HeaderNavRight />
    </StyledNav>
  </StyledHeader>
);
