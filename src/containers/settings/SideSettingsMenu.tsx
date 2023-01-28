import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import { useRouter } from "next/router";

import { useAppHref } from "../../../util/hooks/useAppHref";
import { useThemeContext } from "../../contexts/theme";

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

const StyledListItemButton = styled(ListItemButton)`
  && {
    padding: 8px 12px;
    border-radius: 6px;
    &:hover {
      background-color: ${({ theme }) => theme.palette.secondary.light};
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

export const SideSettingsMenu = () => {
  const router = useRouter();
  const appHref = useAppHref();

  const currentPath = router.pathname.split("/")[4] ?? "";
  const { theme } = useThemeContext();
  const breakpoint = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <StyledList>
      {Object.entries(sideSettingsTabs).map(([path, { label }]) => (
        <>
          <Link href={`${appHref}/settings/${path}`} passHref key={path}>
            <ListItem key={path} disablePadding>
              <StyledListItemButton disableRipple>
                <Typography
                  variant="body2"
                  lineHeight="24px"
                  style={{
                    color:
                      path === currentPath
                        ? theme.palette.primary.light
                        : theme.palette.grey[500],
                  }}
                >
                  {label}
                </Typography>
              </StyledListItemButton>
            </ListItem>
          </Link>
          {breakpoint && <Divider />}
        </>
      ))}
    </StyledList>
  );
};
