import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/system/Box";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";

import { signIn } from "../../../util/hooks/useSignIn";
import { ButtonRef } from "../../../util/types";
import { LoadingButton } from "../../components/LoadingButton";
import { AccountAvatarMenu } from "./AccountAvatarMenu";

export const HeaderNavRight = () => {
  const { status } = useSession();

  const signInButtonRef = useRef<HTMLButtonElement>(null);
  const [loadingRef, setLoadingRef] = useState<ButtonRef | null>(null);

  const logIn = () => {
    setLoadingRef(signInButtonRef);
    try {
      signIn();
    } catch {
      setLoadingRef(null);
    }
  };

  switch (status) {
    case "loading":
      return (
        <IconButton style={{ padding: 5, marginRight: 4 }}>
          <Skeleton variant="circular" width={32} height={32} />
        </IconButton>
      );
    case "authenticated":
      return (
        <Box display="flex" alignItems="center" gap={1}>
          <AccountAvatarMenu />
        </Box>
      );
    default:
      return (
        <LoadingButton
          variant="outlined"
          ref={signInButtonRef}
          loading={loadingRef === signInButtonRef}
          onClick={logIn}
          style={{ marginRight: "6px" }}
        >
          Log in
        </LoadingButton>
      );
  }
};
