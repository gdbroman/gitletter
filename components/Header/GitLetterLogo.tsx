import { Button, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

const getLogoHref = (status) => {
  switch (status) {
    case "loading":
      return "#";
    case "authenticated":
      return "/account";
    default:
      return "/";
  }
};

export const GitLetterLogo = () => {
  const { status } = useSession();
  const href = useMemo(() => getLogoHref(status), [status]);

  return (
    <Link href={href} passHref>
      <Button
        style={{
          display: "flex",
          gap: 4,
        }}
      >
        <Image
          src="/logo.svg"
          alt="Git Letter logo"
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
      </Button>
    </Link>
  );
};
