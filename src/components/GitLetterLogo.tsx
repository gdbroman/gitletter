import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import Image from "next/image";
import Link from "next/link";

import { useAppHref } from "../../util/hooks/useAppHref";

export const GitLetterLogo = () => {
  const appHref = useAppHref();

  return (
    <Link href={appHref}>
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
