// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export enum EventAction {
  LOGIN = "login",
  SEARCH = "search",
  SELECT_CONTENT = "select_content",
  VIEW_ITEM = "view_item",
  SIGN_UP = "sign_up",
  SHARE = "share",
}

export const sendPageView = (url: URL) => {
  window.gtag("config", process.env.GOOGLE_ANALYTICS_TRACKING_ID, {
    page_path: url,
  });
};

type GTagEvent = {
  action: EventAction;
  label: string;
  category?: "ecommerce" | "engagement" | "general";
  value?: number;
};

export const sendEvent = ({
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
