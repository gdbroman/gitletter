import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { useThemeContext } from "../../contexts/theme";

export const DarkModeToggle = () => {
  const { colorMode, setColorMode } = useThemeContext();

  return (
    <ToggleButtonGroup
      value={colorMode}
      exclusive
      onChange={(_, value) => setColorMode(value)}
      aria-label="color mode"
      style={{
        display: "flex",
        width: "100%",
      }}
    >
      <ToggleButton value={"light"} aria-label="light mode" style={{ flex: 1 }}>
        <LightModeIcon />
        Light
      </ToggleButton>
      <ToggleButton value={"dark"} aria-label="dark mode" style={{ flex: 1 }}>
        <DarkModeIcon />
        Dark
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
