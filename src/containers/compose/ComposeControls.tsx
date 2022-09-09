import SettingsIcon from "@mui/icons-material/Settings";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { FC } from "react";

import { useThemeContext } from "../../contexts/theme";
import { SendMenu, SendMenuProps } from "./SendMenu";

export const composeControlsFooterHeight = "68px";

type Props = SendMenuProps & {
  isPreview: boolean;
  toggleSettings: () => void;
  togglePreview: () => void;
};

export const ComposeControls: FC<Props> = ({
  isPreview,
  toggleSettings,
  togglePreview,
  toggleTest,
  toggleSend,
}) => {
  const { theme } = useThemeContext();

  return (
    <footer
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.palette.secondary.light,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        height={composeControlsFooterHeight}
        px={2}
      >
        <Tooltip title={"Settings"}>
          <IconButton onClick={toggleSettings}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Box display="flex" alignItems="center" gap={2}>
          <Tooltip title={isPreview ? "Hide preview" : "Show preview"}>
            <IconButton onClick={togglePreview}>
              {isPreview ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </Tooltip>
          <SendMenu toggleTest={toggleTest} toggleSend={toggleSend} />
        </Box>
      </Box>
    </footer>
  );
};
