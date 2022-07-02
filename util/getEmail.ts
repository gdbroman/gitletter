import slugify from "slugify";

import { siteDomain } from "./constants";

export const getEmailAddress = (newsletterName: string) => {
  return `${slugify(newsletterName.toLowerCase())}@${siteDomain}`;
};
