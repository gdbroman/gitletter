import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";

export const ProtectedPage = ({ children }) => {
  const router = useRouter();
  const { status } = useSession();
  const loading = useMemo(() => status === "loading", [status]);
  const unauthenticated = useMemo(() => status === "unauthenticated", [status]);

  useEffect(() => {
    if (unauthenticated) {
      router.push("/");
    }
  }, [router, unauthenticated]);

  if (loading || unauthenticated) return null;

  return <>{children}</>;
};
