import styled from "@emotion/styled";
import LoadingButton from "@mui/lab/LoadingButton";
import { IconButton, Skeleton } from "@mui/material";
import Box from "@mui/system/Box";
import { useSession } from "next-auth/react";

import { useSignIn } from "../../util/hooks";
import { AccountAvatarMenu } from "./AccountAvatarMenu";

export const LoadingButtonWithBlackSpinner = styled(LoadingButton)`
  &:disabled .MuiLoadingButton-loadingIndicator {
    color: #000000;
    background-color: transparent;
  }
`;

export const HeaderNavRight = () => {
  const { status } = useSession();
  const { signIn, loading } = useSignIn();

  switch (status) {
    case "loading":
      return (
        <IconButton style={{ padding: 5 }}>
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
          loading={loading}
          onClick={signIn}
          style={{ marginRight: "6px" }}
        >
          Log in
        </LoadingButtonWithBlackSpinner>
      );
  }
};
