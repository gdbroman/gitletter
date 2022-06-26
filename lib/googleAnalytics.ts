// log the pageview with their URL
export const pageview = (url: string) => {
  (window as any).gtag("config", process.env.GOOGLE_ANALYTICS_TRACKING_ID, {
    page_path: url,
  });
};

// log specific events happening.
export const event = ({ action, params }) => {
  (window as any).gtag("event", action, params);
};
