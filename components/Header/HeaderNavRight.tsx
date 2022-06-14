import LoadingButton from "@mui/lab/LoadingButton";
import { IconButton, Skeleton } from "@mui/material";
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
          <IconButton style={{ padding: 5 }}>
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
          <LoadingButton variant="outlined" loading={loading} onClick={signIn}>
            Log in
          </LoadingButton>
        </nav>
      );
  }
};
