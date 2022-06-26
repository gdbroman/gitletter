import AddIcon from "@mui/icons-material/Add";
import CodeIcon from "@mui/icons-material/Code";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, MouseEvent, useState } from "react";

import { useToggle } from "../../util/hooks";
import { AddSubscriberDialog } from "./AddSubscriberDialog";
import { DashboardProps } from "./Dashboard";

export const NavBarCta: FC<Pick<DashboardProps, "newsletterId">> = ({
  newsletterId,
}) => {
  const router = useRouter();

  switch (router.pathname) {
    case "/app/settings":
      return null;
    case "/app/subscribers":
      return <ManageButtonMenu newsletterId={newsletterId} />;
    default:
      return (
        <Link href={`/app/compose?n=${newsletterId}`} passHref>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            style={{ minWidth: "119px" }}
          >
            Compose
          </Button>
        </Link>
      );
  }
};

const ManageButtonMenu: FC<Pick<DashboardProps, "newsletterId">> = ({
  newsletterId,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const dialogOpen = useToggle(false);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    dialogOpen.toggleOn();
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
        style={{ minWidth: "108px" }}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Manage
      </Button>
      <StyledMenu anchorEl={anchorEl} open={menuOpen} onClose={handleClose}>
        <MenuItem onClick={handleClose} disableRipple>
          <AddIcon />
          <Typography variant="body1">Manually add a subscriber</Typography>
        </MenuItem>
        <MenuItem disabled disableRipple>
          <CodeIcon />
          <Typography variant="body1">Integration (in progress)</Typography>
        </MenuItem>
      </StyledMenu>
      <AddSubscriberDialog
        newsletterId={newsletterId}
        open={dialogOpen.isOn}
        onClose={dialogOpen.toggleOff}
      />
    </>
  );
};

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
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
