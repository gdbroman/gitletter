import { Typography } from "@mui/material";
import Box from "@mui/system/Box";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

const getLogoHref = (status) => {
  switch (status) {
    case "loading":
      return "#";
    case "authenticated":
      return "/app";
    default:
      return "/";
  }
};

export const GitLetterLogo = () => {
  const { status } = useSession();
  const href = useMemo(() => getLogoHref(status), [status]);

  return (
    <Link href={href}>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        style={{ cursor: "pointer" }}
      >
        <Image
          src="/logo.svg"
          alt="GitLetter logo"
          width={32}
          height={32}
          layout="fixed"
        />

        <Typography
          color="secondary"
          variant="h2"
          fontWeight="bold"
          style={{
            fontSize: "20px",
          }}
        >
          GitLetter
        </Typography>
      </Box>
    </Link>
  );
};
