import styled from "@emotion/styled";
import HomeIcon from "@mui/icons-material/Home";
import Logout from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth/core/types";
import { signOut, useSession } from "next-auth/react";
import { MouseEvent, useState } from "react";

const HeaderMenuItem = styled(MenuItem)`
  && {
    &:hover {
      background-color: transparent;
      cursor: initial;
    }
  }
`;

type ProfileAvatarProps = {
  sessionData: Session;
  size?: number;
};

const ProfileAvatar = ({ sessionData, size = 32 }: ProfileAvatarProps) => (
  <Avatar sx={{ width: size, height: size }} key={size}>
    {sessionData?.user?.image ? (
      <Image src={sessionData?.user?.image} width={size} height={size} />
    ) : (
      sessionData?.user?.name.charAt(0)
    )}
  </Avatar>
);

export const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const session = useSession();

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-haspopup="true"
            aria-controls={open ? "account-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
          >
            <ProfileAvatar sessionData={session.data} />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            maxWidth: 240,
            "& .MuiAvatar-root": {
              width: 38,
              height: 38,
              mr: 1.5,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <HeaderMenuItem
          disableRipple
          disableTouchRipple
          onClick={(event) => event.stopPropagation()}
        >
          <ProfileAvatar size={38} sessionData={session.data} />
          <Box>
            <Typography
              variant="body2"
              lineHeight={1.25}
              fontWeight={600}
              noWrap
            >
              {session.data?.user.name}
            </Typography>
            <Typography variant="body2" noWrap lineHeight={1.25}>
              {session.data?.user.email}
            </Typography>
          </Box>
        </HeaderMenuItem>
        <Divider />
        <Link href="/app" passHref>
          <MenuItem>
            <ListItemIcon>
              <HomeIcon fontSize="small" />
            </ListItemIcon>
            Your letter
          </MenuItem>
        </Link>
        {/* <Link href="/settings" passHref>
          <MenuItem>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
        </Link> */}
        <MenuItem onClick={() => signOut()}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};
