import slugify from "slugify";

import { siteDomain } from "./constants";

export const getEmailAddress = (newsletterTitle: string) => {
  const removeSpecialCharacters = /[^a-zA-Z0-9- ]/g;

  return `${slugify(newsletterTitle, {
    trim: true,
    lower: true,
    remove: removeSpecialCharacters,
  })}@${siteDomain}`;
};
