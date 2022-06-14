import { Button, CircularProgress, IconButton, Skeleton } from "@mui/material";
import { useSession } from "next-auth/react";

import { useSignIn } from "../../util/hooks";
import { AccountMenu } from "./AccountMenu";

export const HeaderNavRight = () => {
  const { status } = useSession();
  const { signIn, loading } = useSignIn();

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
            startIcon={
              loading && <CircularProgress size={16} color="secondary" />
            }
            disabled={loading}
            onClick={signIn}
          >
            Log in
          </Button>
        </nav>
      );
  }
};
