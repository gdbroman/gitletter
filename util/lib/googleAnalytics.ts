// The default Google Analytics Events (use these for consistent reporting)
// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export enum GAEventAction {
  ADD_PAYMENT_INFO = "add_payment_info",
  ADD_TO_CART = "add_to_cart",
  ADD_TO_WISHLIST = "add_to_wishlist",
  BEGIN_CHECKOUT = "begin_checkout",
  CHECKOUT_PROGRESS = "checkout_progress",
  GENERATE_LEAD = "generate_lead",
  LOGIN = "login",
  PURCHASE = "purchase",
  REFUND = "refund",
  REMOVE_FROM_CART = "remove_from_cart",
  SEARCH = "search",
  SELECT_CONTENT = "select_content",
  SET_CHECKOUT_OPTION = "set_checkout_option",
  SHARE = "share",
  SIGN_UP = "sign_up",
  VIEW_ITEM = "view_item",
  VIEW_ITEM_LIST = "view_item_list",
  VIEW_PROMOTION = "view_promotion",
  VIEW_SEARCH_RESULTS = "view_search_results",
}

export const sendPageView = (url: URL) => {
  window.gtag("config", process.env.GOOGLE_ANALYTICS_TRACKING_ID, {
    page_path: url,
  });
};

type GTagEvent = {
  action: GAEventAction;
  label: string;
  category?: "ecommerce" | "engagement" | "general";
  value?: number;
};

export const sendEvent = ({ action, label, category, value }: GTagEvent) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};
