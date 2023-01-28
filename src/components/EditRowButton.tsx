import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { MouseEvent } from "react";
import { useState } from "react";

import { eatClick } from "../../util/eatClick";
import { StyledMenu } from "../containers/dashboard/TabsNavBarCta";

const StyledRowButton = styled(Button)`
  width: 32px;
  height: 32px;
  min-width: 32px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  color: ${({ theme }) => theme.palette.primary.main};
  background-color: ${({ theme }) => theme.palette.secondary.main};
`;

type Props = {
  onDuplicate?: () => void;
  onDelete: () => void;
};

export const EditRowButton = ({ onDuplicate, onDelete }: Props) => {
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
    onDuplicate?.();
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
            <Typography variant="body1" color="primary.light">
              Duplicate
            </Typography>
          </MenuItem>
        )}
        <MenuItem disableRipple onClick={handleOnDelete}>
          <DeleteIcon />
          <Typography variant="body1" color="primary.light">
            Delete
          </Typography>
        </MenuItem>
      </StyledMenu>
    </>
  );
};
