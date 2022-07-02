import { useSession } from "next-auth/react";
import { useMemo } from "react";

const getHomeRef = (status) => {
  switch (status) {
    case "authenticated":
      return "/app";
    default:
      return "/";
  }
};

export const useGetHomeRef = () => {
  const { status } = useSession();
  const href = useMemo(() => getHomeRef(status), [status]);

  return href;
};
