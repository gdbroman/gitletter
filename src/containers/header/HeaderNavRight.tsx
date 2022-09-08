import LoadingButton from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import { styled } from "@mui/material/styles";
import Box from "@mui/system/Box";
import { useSession } from "next-auth/react";
import { useRef } from "react";

import { useSignIn } from "../../../util/hooks/useSignIn";
import { AccountAvatarMenu } from "./AccountAvatarMenu";

export const LoadingButtonWithBlackSpinner = styled(LoadingButton)`
  &:disabled .MuiLoadingButton-loadingIndicator {
    color: #000000;
    background-color: transparent;
  }
`;

export const HeaderNavRight = () => {
  const { status } = useSession();
  const { signIn, loadingRef } = useSignIn();
  const signInButtonRef = useRef<HTMLButtonElement>(null);

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
        <LoadingButtonWithBlackSpinner
          variant="outlined"
          color="secondary"
          ref={signInButtonRef}
          loading={loadingRef === signInButtonRef}
          onClick={() => signIn(signInButtonRef)}
          style={{ marginRight: "6px" }}
        >
          Log in
        </LoadingButtonWithBlackSpinner>
      );
  }
};
