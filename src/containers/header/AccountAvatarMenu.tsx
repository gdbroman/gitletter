import styled from "@emotion/styled";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth/core/types";
import { signOut, useSession } from "next-auth/react";
import { FC, MouseEvent, useState } from "react";

import { useAppHref } from "../../../util/hooks/useAppHref";

const HeaderMenuItem = styled(MenuItem)`
  && {
    &:hover {
      background-color: transparent;
      cursor: initial;
    }
  }
`;

type AccountAvatarProps = {
  sessionData: Session;
  size?: number;
};

const AccountAvatar = ({ sessionData, size = 32 }: AccountAvatarProps) => (
  <Avatar sx={{ width: size, height: size }} key={size}>
    {sessionData?.user?.image ? (
      <Image src={sessionData?.user?.image} width={size} height={size} />
    ) : (
      sessionData?.user?.name.charAt(0)
    )}
  </Avatar>
);

export const AccountAvatarMenu = () => {
  const session = useSession();
  const appHref = useAppHref();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        mr={0.5}
        sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
      >
        <AvatarToolTip
          userName={session.data?.user?.name}
          userEmail={session.data?.user?.email}
        >
          <IconButton
            onClick={handleClick}
            size="small"
            aria-haspopup="true"
            aria-controls={open ? "account-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
          >
            <AccountAvatar sessionData={session.data} />
          </IconButton>
        </AvatarToolTip>
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
            maxWidth: 300,
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
          tabIndex={-1}
          disableRipple
          disableTouchRipple
          onClick={(event) => event.stopPropagation()}
        >
          <AccountAvatar size={38} sessionData={session.data} />
          <Box minWidth={0}>
            <Typography
              variant="body2"
              lineHeight={1.3}
              fontWeight={600}
              noWrap
            >
              {session.data?.user.name}
            </Typography>
            <Typography variant="body2" lineHeight={1.3} noWrap>
              {session.data?.user.email}
            </Typography>
          </Box>
        </HeaderMenuItem>
        <Divider />
        <Link href={appHref} passHref>
          <MenuItem>Dashboard</MenuItem>
        </Link>
        <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
      </Menu>
    </>
  );
};

type AvatarToolTipProps = {
  userName: string;
  userEmail: string;
  children: JSX.Element;
};

const AvatarToolTip: FC<AvatarToolTipProps> = ({
  userName,
  userEmail,
  children,
}) => (
  <Tooltip
    enterDelay={500}
    title={
      <>
        <Typography
          variant="caption"
          fontWeight="bold"
          lineHeight="16px"
          style={{ display: "block", margin: 0 }}
        >
          GitLetter account
        </Typography>
        <Typography
          variant="caption"
          lineHeight="16px"
          letterSpacing={0.5}
          style={{ display: "block", margin: 0 }}
        >
          {userName}
        </Typography>
        <Typography
          variant="caption"
          lineHeight="16px"
          letterSpacing={0.5}
          style={{ display: "block", margin: 0 }}
        >
          {userEmail}
        </Typography>
      </>
    }
  >
    {children}
  </Tooltip>
);
