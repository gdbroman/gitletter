import { useMemo } from "react";

import { useNewsletterContext } from "../../contexts/newsletter";

export const useAppHref = () => {
  const { newsletterId } = useNewsletterContext();

  const appHref = useMemo(() => {
    if (newsletterId) {
      return `/app/${newsletterId}`;
    }
    return "/";
  }, [newsletterId]);

  return appHref;
};
