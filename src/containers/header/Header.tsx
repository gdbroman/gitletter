import { styled } from "@mui/material/styles";
import Box from "@mui/system/Box";

import { GitLetterLogo } from "../../components/GitLetterLogo";
import { HeaderNavRight } from "./HeaderNavRight";

const StyledHeader = styled("header")`
  display: flex;
  height: 64px;
  min-height: 64px;
  padding: 8px;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.palette.secondary.light};
`;

const StyledNav = styled("nav")`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
`;

type Props = {
  title?: string;
};

export const Header = ({ title }: Props) => (
  <StyledHeader>
    <StyledNav>
      <Box display="flex" ml={1} flex={1} minWidth={0}>
        <GitLetterLogo title={title} />
      </Box>
      <HeaderNavRight />
    </StyledNav>
  </StyledHeader>
);
