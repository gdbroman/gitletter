import { IconButton } from "@mui/material";
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
      <IconButton>
        <Image src="/android-chrome-192x192.png" width={32} height={32} />
      </IconButton>
    </Link>
  );
};
