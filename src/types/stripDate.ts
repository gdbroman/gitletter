import { Issue, Newsletter, Subscriber } from "@prisma/client";

export type IssueWithStrippedDate = Issue & {
  sentAt: string;
  createdAt: string;
  updatedAt: string;
};

export type SubscriberWithStrippedDate = Subscriber & {
  addedAt: string;
};

export type NewsletterWithStrippedDate = Newsletter & {
  issues: IssueWithStrippedDate[];
  subscribers: SubscriberWithStrippedDate[];
};

type StripDate = (
  obj: Partial<Newsletter> | Partial<Issue> | Partial<Subscriber>
) =>
  | IssueWithStrippedDate
  | SubscriberWithStrippedDate
  | NewsletterWithStrippedDate;

export const stripDate: StripDate = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    let value = obj[key];
    if (value !== null) {
      // If array, loop...
      if (Array.isArray(value)) {
        value = value.map((item) => stripDate(item));
      }
      // ...if property is date/time, stringify/parse...
      else if (
        typeof value === "object" &&
        typeof value.getMonth === "function"
      ) {
        value = JSON.parse(JSON.stringify(value));
      }
      // ...and if a deep object, loop.
      else if (typeof value === "object") {
        value = stripDate(value);
      }
    }
    newObj[key] = value;
  });

  return newObj as ReturnType<StripDate>;
};
