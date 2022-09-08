import { styled } from "@mui/material/styles";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { FC, MouseEvent, useState } from "react";

import { eatClick } from "../../util/eatClick";
import { StyledMenu } from "../containers/dashboard/TabsNavBarCta";

const StyledRowButton = styled(Button)`
  width: 32px;
  height: 32px;
  min-width: 32px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  background-color: white;
`;

type Props = {
  onDuplicate?: () => void;
  onDelete: () => void;
};

export const EditRowButton: FC<Props> = ({ onDuplicate, onDelete }) => {
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
  const handleOnDuplicate = (event: MouseEvent<HTMLElement>) => {
    onDuplicate();
    handleOnClose(event);
  };
  const handleOnDelete = (event: MouseEvent<HTMLElement>) => {
    onDelete();
    handleOnClose(event);
  };

  return (
    <>
      <StyledRowButton id="more" aria-label="more" onClick={handleOnClick}>
        <MoreVertIcon />
      </StyledRowButton>
      <StyledMenu anchorEl={anchorEl} open={menuOpen} onClose={handleOnClose}>
        {onDuplicate && (
          <MenuItem disableRipple onClick={handleOnDuplicate}>
            <ContentCopyIcon />
            <Typography variant="body1">Duplicate</Typography>
          </MenuItem>
        )}
        <MenuItem disableRipple onClick={handleOnDelete}>
          <DeleteIcon />
          <Typography variant="body1">Delete</Typography>
        </MenuItem>
      </StyledMenu>
    </>
  );
};
