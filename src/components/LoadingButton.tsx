import MuiLoadingButton from "@mui/lab/LoadingButton";
import MuiButton from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import type { ComponentProps, FC, ReactNode } from "react";

const StyledMuiLoadingButton = styled(MuiLoadingButton)`
  && {
    &:disabled .MuiLoadingButton-loadingIndicator {
      ${({ theme, variant }) =>
        variant === "contained"
          ? `
      color: ${theme.palette.secondary.main};
      `
          : `
      color: ${theme.palette.primary.main};
    `}
  }
`;

type Props = {
  children: ReactNode;
  loading?: boolean;
} & ComponentProps<typeof MuiButton>;

export const LoadingButton: FC<Props> = ({ children, loading, ...props }) => (
  <>
    {loading ? (
      <StyledMuiLoadingButton {...props} loading>
        {children}
      </StyledMuiLoadingButton>
    ) : (
      <MuiButton {...props}>{children}</MuiButton>
    )}
  </>
);
