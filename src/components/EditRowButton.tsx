import styled from "@emotion/styled";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { FC, MouseEvent, useState } from "react";

import { StyledMenu } from "../containers/dashboard/NavBarCta";
import { eatClick } from "../util/eatClick";

const StyledRowButton = styled(Button)`
  width: 32px;
  height: 32px;
  min-width: 32px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  background-color: white;
`;

type Props = {
  onDelete: () => void;
};

export const EditRowButton: FC<Props> = ({ onDelete }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleOnClick = (event: MouseEvent<HTMLElement>) => {
    eatClick(event);
    setAnchorEl(event.currentTarget);
  };
  const handleOnClose = (event: MouseEvent<HTMLElement>) => {
    eatClick(event);
    setAnchorEl(null);
  };
  const handleOnDelete = (event: MouseEvent<HTMLElement>) => {
    eatClick(event);
    onDelete();
  };

  return (
    <>
      <StyledRowButton id="more" aria-label="more" onClick={handleOnClick}>
        <MoreVertIcon />
      </StyledRowButton>
      <StyledMenu anchorEl={anchorEl} open={menuOpen} onClose={handleOnClose}>
        <MenuItem disableRipple onClick={handleOnDelete}>
          <DeleteIcon />
          <Typography variant="body1">Delete</Typography>
        </MenuItem>
      </StyledMenu>
    </>
  );
};
