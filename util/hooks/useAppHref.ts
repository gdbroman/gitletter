import { useRouter } from "next/router";
import { useMemo } from "react";

export const getAppBasePath = (newsletterId: string) => `/app/${newsletterId}`;

export const useAppHref = () => {
  const router = useRouter();
  const newsletterId = router.query.newsletterId as string;

  const appHref = useMemo(() => {
    if (newsletterId) {
      return getAppBasePath(newsletterId);
    }
    return "/";
  }, [newsletterId]);

  return appHref;
};
