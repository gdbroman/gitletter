import Box from "@mui/material/Box";
import { FC } from "react";

import { SendMenu, SendMenuProps } from "./SendMenu";

export const composeControlsFooterHeight = "68px";

type Props = SendMenuProps;

export const ComposeControls: FC<Props> = ({ toggleTest, toggleSend }) => (
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
      <SendMenu toggleTest={toggleTest} toggleSend={toggleSend} />
    </Box>
  </footer>
);
