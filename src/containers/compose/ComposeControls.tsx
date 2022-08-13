import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { FC } from "react";

import { SendMenu, SendMenuProps } from "./SendMenu";

export const composeControlsFooterHeight = "68px";

type Props = SendMenuProps & {
  isPreview: boolean;
  togglePreview: () => void;
};

export const ComposeControls: FC<Props> = ({
  isPreview,
  togglePreview,
  toggleTest,
  toggleSend,
}) => (
  <footer
    style={{
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#eeeeee",
    }}
  >
    <Box
      display="flex"
      justifyContent="end"
      alignItems="center"
      height={composeControlsFooterHeight}
      px={2}
      gap={2}
    >
      <Tooltip title={isPreview ? "Hide preview" : "Show preview"}>
        <IconButton onClick={togglePreview}>
          {isPreview ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </Tooltip>
      <SendMenu toggleTest={toggleTest} toggleSend={toggleSend} />
    </Box>
  </footer>
);
