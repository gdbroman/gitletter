import { useMemo } from "react";

import { useNewsletterContext } from "../../src/contexts/newsletter";

export const getAppBasePath = (newsletterId: string) => `/app/${newsletterId}`;

export const useAppHref = () => {
  const { newsletterId } = useNewsletterContext();

  const appHref = useMemo(() => {
    if (newsletterId) {
      return getAppBasePath(newsletterId);
    }
    return "/";
  }, [newsletterId]);

  return appHref;
};
