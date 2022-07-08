import NProgress from "nprogress";

const start = () => {
  NProgress.start();
};

const done = () => {
  NProgress.done();
};

export const progressIndicator = {
  start,
  done,
};
