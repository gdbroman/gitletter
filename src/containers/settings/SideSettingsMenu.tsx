import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

import { useAppHref } from "../../../util/hooks/useAppHref";

const StyledList = styled(List)`
  && {
    display: flex;
    flex-direction: column;
    min-width: 190px;
    padding: 0;
    gap: 8px;

    @media screen and (max-width: ${({ theme }) =>
        theme.breakpoints.values.md}px) {
      margin-bottom: 16px;
    }
  }
`;

const StyledListItem = styled(ListItem)`
  && {
    .MuiListItemButton-root {
      color: #fff;
    }
  }
`;

const StyledListItemButton = styled(ListItemButton)`
  && {
    padding: 8px 12px;
    border-radius: 6px;
    &:hover {
      background-color: ${({ theme }) => theme.palette.grey[200]};
    }
  }
`;

const sideSettingsTabs = {
  "": {
    label: "General",
  },
  github: {
    label: "GitHub",
  },
  billing: {
    label: "Billing",
  },
};

export const SideSettingsMenu: FC = () => {
  const router = useRouter();
  const appHref = useAppHref();

  const currentPath = router.pathname.split("/")[4] ?? "";
  const theme = useTheme();
  const breakpoint = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <StyledList>
      {Object.entries(sideSettingsTabs).map(([path, { label }]) => (
        <>
          <Link href={`${appHref}/settings/${path}`} passHref key={path}>
            <StyledListItem key={path} disablePadding>
              <StyledListItemButton disableRipple>
                <Typography
                  variant="body2"
                  lineHeight="24px"
                  sx={{
                    color: path === currentPath ? "#000" : "#666",
                  }}
                >
                  {label}
                </Typography>
              </StyledListItemButton>
            </StyledListItem>
          </Link>
          {breakpoint && <Divider />}
        </>
      ))}
    </StyledList>
  );
};
