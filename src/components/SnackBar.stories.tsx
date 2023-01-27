import { Meta, Story } from "@storybook/react";
import React from "react";

import { Snackbar, SnackbarProps } from "./Snackbar";

export default {
  component: Snackbar,
  title: "Snackbar",
} as Meta;

const Template: Story<SnackbarProps> = (args) => <Snackbar {...args} />;

export const Success = Template.bind({});
Success.args = {
  message: "A success message.",
  severity: "success",
  isOpen: true,
};

export const Info = Template.bind({});
Info.args = {
  message: "An info message.",
  severity: "info",
  isOpen: true,
};

export const Warning = Template.bind({});
Warning.args = {
  message: "A warning message.",
  severity: "warning",
  isOpen: true,
};

export const Error = Template.bind({});
Error.args = {
  message: "An error message.",
  severity: "error",
  isOpen: true,
};
