import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { PreviewMenu } from "./PreviewMenu";

export const composeControlsFooterHeight = "68px";

export const ComposeControls = ({
  isPreview,
  toggleTest,
  togglePreview,
  onClickSend,
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
      {isPreview ? (
        <Button variant="text" onClick={togglePreview}>
          Edit
        </Button>
      ) : (
        <PreviewMenu onSend={toggleTest} onShow={togglePreview} />
      )}

      <Button variant="contained" onClick={onClickSend}>
        Send
      </Button>
    </Box>
  </footer>
);
