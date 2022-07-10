import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ButtonBaseProps } from "@mui/material/ButtonBase";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import { FC, MouseEvent, useState } from "react";

export const composeControlsFooterHeight = "68px";

export const ComposeControls = ({ isPreview, togglePreview, onClickSend }) => {
  const [previewMenuAnchorEl, setPreviewMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const previewMenuOpen = Boolean(previewMenuAnchorEl);
  const handleClickPreviewMenu = (event: MouseEvent<HTMLElement>) => {
    setPreviewMenuAnchorEl(event.currentTarget);
  };
  const handleClosePreviewMenu = () => {
    setPreviewMenuAnchorEl(null);
  };

  return (
    <>
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
            <EditButton onClick={togglePreview} />
          ) : (
            <PreviewButton onClick={handleClickPreviewMenu} />
          )}
          <Button variant="contained" onClick={onClickSend}>
            Send
          </Button>
        </Box>
      </footer>
      <PreviewMenu
        anchorEl={previewMenuAnchorEl}
        open={previewMenuOpen}
        onShowPreview={togglePreview}
        onSendPreview={togglePreview}
        onClose={handleClosePreviewMenu}
      />
    </>
  );
};

const EditButton: FC<Pick<ButtonBaseProps, "onClick">> = ({ onClick }) => (
  <Button variant="text" onClick={onClick}>
    Edit
  </Button>
);

const PreviewButton: FC<Pick<ButtonBaseProps, "onClick">> = ({ onClick }) => (
  <Button variant="text" onClick={onClick} endIcon={<ArrowDropUpIcon />}>
    Preview
  </Button>
);

const PreviewMenu = ({
  anchorEl,
  open,
  onShowPreview,
  onSendPreview,
  onClose,
}) => (
  <StyledMenu anchorEl={anchorEl} open={open} onClose={onClose}>
    <MenuItem
      onClick={() => {
        onClose();
        onShowPreview();
      }}
      disableRipple
    >
      Show email preview
    </MenuItem>
    <MenuItem
      onClick={() => {
        onClose();
        onSendPreview();
      }}
      disableRipple
    >
      Send a preview
    </MenuItem>
  </StyledMenu>
);

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    disableScrollLock
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));
