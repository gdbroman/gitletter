import { Button, Typography } from "@mui/material";
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
      <Button>
        <Typography
          color="secondary"
          variant="h2"
          fontWeight="bold"
          style={{
            fontSize: "22px",
          }}
        >
          GitLetter
        </Typography>
      </Button>
    </Link>
  );
};
