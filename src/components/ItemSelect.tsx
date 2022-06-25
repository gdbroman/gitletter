import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent, SelectProps } from "@mui/material/Select";
import { Theme, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { FC, ReactNode } from "react";

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

type Props = Omit<SelectProps, "onChange"> & {
  items: string[];
  label: string;
  helperText?: ReactNode;
  value: string | undefined;
  onChange: (value: string) => void;
};

export const ItemSelect: FC<Props> = ({
  items,
  label,
  helperText,
  value,
  onChange,
  ...rest
}) => {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof value>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel id="item-select-label">{label}</InputLabel>
      <Select
        id="item-select"
        labelId="item-select-label"
        MenuProps={MenuProps}
        input={<OutlinedInput label={label} fullWidth />}
        sx={{ width: 300 }}
        value={value}
        onChange={handleChange}
        {...rest}
      >
        {items.map((item) => (
          <MenuItem
            key={item}
            value={item}
            style={getStyles(item, value, theme)}
          >
            {item}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <Typography variant="body2" color="gray" mt={1}>
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};
