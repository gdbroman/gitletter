import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import type { FC } from "react";
import React from "react";

export type SendMenuProps = {
  toggleTest: () => void;
  toggleSend: () => void;
};

export const SendMenu: FC<SendMenuProps> = ({ toggleTest, toggleSend }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTest = () => {
    toggleTest();
    handleClose();
  };
  const handleSend = () => {
    toggleSend();
    handleClose();
  };

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        id="basic-button"
        aria-controls={open ? "preview-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        endIcon={<KeyboardArrowUpIcon />}
        onClick={handleClick}
      >
        Send
      </Button>
      <Menu
        id="preview-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "preview-button",
        }}
      >
        <MenuItem onClick={handleTest}>
          <ListItemIcon>
            <AlternateEmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send a test email</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSend}>
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send issue</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};
