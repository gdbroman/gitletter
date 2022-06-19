import styled from "@emotion/styled";
import LoadingButton from "@mui/lab/LoadingButton";
import { IconButton, Skeleton } from "@mui/material";
import { useSession } from "next-auth/react";

import { useSignIn } from "../../util/hooks";
import { AccountMenu } from "./AccountMenu";

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
      return <AccountMenu />;
    default:
      return (
        <LoadingButtonWithBlackSpinner
          variant="outlined"
          loading={loading}
          onClick={signIn}
        >
          Log in
        </LoadingButtonWithBlackSpinner>
      );
  }
};
