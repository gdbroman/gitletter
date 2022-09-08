import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

import { useAppHref } from "../../util/hooks/useAppHref";
import { useThemeContext } from "../contexts/theme";

type Props = {
  title?: string;
};

export const GitLetterLogo: FC<Props> = ({ title = "GitLetter" }) => {
  const { colorMode } = useThemeContext();
  const appHref = useAppHref();

  return (
    <Link href={appHref}>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        style={{ cursor: "pointer" }}
        minWidth={0}
      >
        <Image
          src="/logo.svg"
          alt="GitLetter logo"
          width={32}
          height={32}
          layout="fixed"
          style={{
            filter: colorMode === "dark" ? "invert(1)" : "none",
          }}
        />
        <Typography
          flex={1}
          color="secondary"
          variant="h2"
          fontWeight="bold"
          noWrap
          style={{
            fontSize: "20px",
          }}
        >
          {title}
        </Typography>
      </Box>
    </Link>
  );
};
