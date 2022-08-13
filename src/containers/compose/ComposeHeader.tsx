import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { FC } from "react";

import {
  ComposeBreadCrumbs,
  ComposeBreadCrumbsProps,
} from "./ComposeBreadCrumbs";

type Props = ComposeBreadCrumbsProps & {
  isSent: boolean;
  isPreview: boolean;
  togglePreview: () => void;
};

export const ComposeHeader: FC<Props> = ({
  newsletterId,
  newsletterTitle,
  fileName,
  isSent,
  isPreview,
  togglePreview,
  onChange,
  onBlur,
}) => {
  return (
    <Box
      display="flex"
      height="36px"
      alignItems="center"
      justifyContent="space-between"
      mb={1}
    >
      <ComposeBreadCrumbs
        newsletterId={newsletterId}
        newsletterTitle={newsletterTitle}
        fileName={fileName}
        disableEdit={isSent}
        onChange={onChange}
        onBlur={onBlur}
      />
      {!isSent && (
        <Tooltip title={isPreview ? "Hide preview" : "Show preview"}>
          <IconButton onClick={togglePreview}>
            {isPreview ? (
              <VisibilityOffIcon fontSize="small" />
            ) : (
              <VisibilityIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
