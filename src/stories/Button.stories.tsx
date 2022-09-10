import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { Button } from "../components/Button";
import { useThemeContext } from "../contexts/theme";

export default {
  title: "Button",
  component: Button,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => {
  const { isDarkMode, setColorMode } = useThemeContext();

  const toggleColorMode = () => {
    setColorMode(isDarkMode ? "light" : "dark");
  };

  return <Button onClick={toggleColorMode} {...args} />;
};

export const Contained = Template.bind({});
Contained.args = {
  label: "Button",
  variant: "contained",
  color: "primary",
  size: "medium",
  loading: false,
  disabled: false,
};

export const Outlined = Template.bind({});
Outlined.args = {
  label: "Button",
  variant: "outlined",
  color: "primary",
  size: "medium",
  loading: false,
  disabled: false,
};

export const Text = Template.bind({});
Text.args = {
  label: "Button",
  variant: "text",
  color: "primary",
  size: "medium",
  loading: false,
  disabled: false,
};
