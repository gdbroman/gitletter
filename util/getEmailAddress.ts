import slugify from "slugify";

import { siteDomain } from "./constants";

export const getEmailAddress = (newsletterName: string) => {
  const removeSpecialCharacters = /[^a-zA-Z0-9- ]/g;

  return `${slugify(newsletterName, {
    trim: true,
    lower: true,
    remove: removeSpecialCharacters,
  })}@${siteDomain}`;
};
