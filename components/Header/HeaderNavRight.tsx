import { Button, IconButton, Skeleton } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { AccountMenu } from "./AccountMenu";

export const HeaderNavRight = () => {
  const { status } = useSession();

  switch (status) {
    case "loading":
      return (
        <nav>
          <IconButton>
            <Skeleton variant="circular" width={32} height={32} />
          </IconButton>
        </nav>
      );
    case "authenticated":
      return (
        <nav>
          <AccountMenu />
        </nav>
      );
    default:
      return (
        <nav>
          <Link href="/api/auth/signin" passHref>
            <Button variant="outlined">Log in</Button>
          </Link>
        </nav>
      );
  }
};
