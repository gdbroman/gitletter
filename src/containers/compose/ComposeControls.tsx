import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export const composeControlsFooterHeight = "68px";

export const ComposeControls = ({ isPreview, togglePreview, onClickSend }) => (
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
      <Button variant="text" onClick={togglePreview}>
        {isPreview ? "Edit" : "Preview"}
      </Button>
      <Button variant="contained" onClick={onClickSend}>
        Send
      </Button>
    </Box>
  </footer>
);
