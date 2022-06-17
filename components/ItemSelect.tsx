import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Theme, useTheme } from "@mui/material/styles";
import { FC, ReactNode, useState } from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getStyles = (item: string, selectedItem: string, theme: Theme) => {
  return {
    fontWeight:
      selectedItem?.indexOf(item) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
};

type Props = {
  items: string[];
  label: string;
  helperText?: ReactNode;
};

export const ItemSelect: FC<Props> = ({ items, label, helperText }) => {
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState<string | undefined>();

  const handleChange = (event: SelectChangeEvent<typeof selectedItem>) => {
    setSelectedItem(event.target.value);
  };

  return (
    <FormControl sx={{ width: 300 }}>
      <InputLabel id="item-select-label">{label}</InputLabel>
      <Select
        labelId="item-select-label"
        id="item-select"
        value={selectedItem}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        MenuProps={MenuProps}
      >
        {items.map((item) => (
          <MenuItem
            key={item}
            value={item}
            style={getStyles(item, selectedItem, theme)}
          >
            {item}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
