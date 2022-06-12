import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const ProtectedPage = ({ children }) => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [router, status]);

  return <>{children}</>;
};
