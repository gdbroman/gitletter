import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";

import Layout from "./Layout";

type Props = {
  children: ReactNode;
};

export const ProtectedPage = ({ children }: Props) => {
  const router = useRouter();
  const { status } = useSession();
  const loading = useMemo(() => status === "loading", [status]);
  const unauthenticated = useMemo(() => status === "unauthenticated", [status]);

  useEffect(() => {
    if (unauthenticated) {
      router.push("/");
    }
  }, [router, unauthenticated]);

  if (loading || unauthenticated)
    return (
      <Layout>
        <Box mt={6}>
          <Skeleton variant="rectangular" width={380} height={56} />
        </Box>
        <Box mt={4}>
          <Skeleton variant="rectangular" width={780} height={48} />
        </Box>
        <Box mt={2}>
          <Skeleton variant="rectangular" width={780} height={100} />
        </Box>
      </Layout>
    );

  return <>{children}</>;
};
