import { EventAction, EventLabel } from "../../src/types/analytics";

export const pageview = (url: URL) => {
  window.gtag("config", process.env.GOOGLE_ANALYTICS_TRACKING_ID, {
    page_path: url,
  });
};

type GTagEvent = {
  action: EventAction;
  label: EventLabel;
  category?: "general";
  value?: number;
};

export const event = ({
  action,
  label,
  category = "general",
  value = 1,
}: GTagEvent) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};
