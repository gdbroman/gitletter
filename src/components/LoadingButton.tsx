import MuiLoadingButton from "@mui/lab/LoadingButton";
import MuiButton from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { ComponentProps, FC, ReactNode } from "react";

import { useThemeContext } from "../contexts/theme";

type Props = {
  children: ReactNode;
  loading?: boolean;
} & ComponentProps<typeof MuiButton>;

export const LoadingButton: FC<Props> = ({ children, loading, ...props }) => {
  const { theme } = useThemeContext();

  return (
    <>
      {loading ? (
        <MuiLoadingButton
          loading
          {...props}
          style={{
            color: theme.palette.primary.main,
          }}
        >
          {children}
        </MuiLoadingButton>
      ) : (
        <MuiButton {...props}>{children}</MuiButton>
      )}
    </>
  );
};

export const LoadingButtonWithBlackSpinner = styled(LoadingButton)`
  &:disabled .MuiLoadingButton-loadingIndicator {
    color: #000000;
    background-color: transparent;
  }
`;
