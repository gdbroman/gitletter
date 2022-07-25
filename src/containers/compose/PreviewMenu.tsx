import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";

export const PreviewMenu = ({ onSend, onShow }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSend = () => {
    onSend();
    handleClose();
  };

  const handleShow = () => {
    onShow();
    handleClose();
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "preview-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Preview
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
        <MenuItem onClick={handleSend}>Send test email</MenuItem>
        <MenuItem onClick={handleShow}>Show preview</MenuItem>
      </Menu>
    </div>
  );
};
