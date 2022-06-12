import styled from "@emotion/styled";
import { Button, IconButton, Skeleton } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { AccountMenu } from "./AccountMenu";

const StyledNav = styled.nav`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const HeaderNavRight = () => {
  const { status } = useSession();

  switch (status) {
    case "loading":
      return (
        <StyledNav>
          <IconButton>
            <Skeleton variant="circular" width={32} height={32} />
          </IconButton>
        </StyledNav>
      );
    case "authenticated":
      return (
        <StyledNav>
          <AccountMenu />
        </StyledNav>
      );
    default:
      return (
        <StyledNav>
          <Link href="/api/auth/signin" passHref>
            <Button variant="text">Log in</Button>
          </Link>
          <Link href="/api/auth/signin" passHref>
            <Button variant="contained">Get started free</Button>
          </Link>
        </StyledNav>
      );
  }
};
