const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  sentry: {
    hideSourceMaps: true,
  },
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  env: {
    APP_URL: process.env.APP_URL,
    GITHUB_APP_URL: process.env.GITHUB_APP_URL,
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
