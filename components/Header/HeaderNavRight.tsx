import { Button, IconButton, Skeleton } from "@mui/material";
import { signIn, useSession } from "next-auth/react";

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
          <Button
            variant="outlined"
            onClick={() => signIn("github", { callbackUrl: "/account" })}
          >
            Log in
          </Button>
        </nav>
      );
  }
};
