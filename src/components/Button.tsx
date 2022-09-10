import LoadingMuiButton from "@mui/lab/LoadingButton";
import MuiButton from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof LoadingMuiButton> & {
  label: string;
  loading: boolean;
};

export const Button = ({ label, loading, ...props }: Props) => {
  return (
    <MuiButton {...props}>
      {loading ? <CircularProgress size={18} /> : label}
    </MuiButton>
  );
};
