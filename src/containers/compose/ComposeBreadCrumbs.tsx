import styled from "@emotion/styled";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import { ChangeEvent, FC } from "react";
import AutosizeInput from "react-input-autosize";

import theme from "../../../styles/theme";

const StyledBreadCrumbs = styled(Breadcrumbs)`
  margin-bottom: 8px;
  ol {
    flex-wrap: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    li {
      &:first-child {
        margin-right: 4px;
      }
      &.MuiBreadcrumbs-separator {
        margin: 0 4px;
      }
      &:last-child {
        flex: 1;
      }
    }
  }
`;

const StyledAutosizeInput = styled(AutosizeInput)`
  input {
    border: none;
    padding: 4px;
    border: 1px solid rgba(255, 255, 255, 0);
    font-family: ${theme.typography.fontFamily};
    font-size: 18px;
    &:focus {
      border: 1px solid rgba(0, 0, 0, 0.23);
      outline: none;
    }
  }
`;

type Props = {
  newsletterTitle: string;
  fileName: string;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTitleBlur: (e: any) => void;
};

export const ComposeBreadCrumbs: FC<Props> = ({
  newsletterTitle,
  fileName,
  onTitleChange,
  onTitleBlur,
}) => (
  <StyledBreadCrumbs aria-label="breadcrumb">
    <Link href="/app" passHref>
      <MuiLink underline="hover" color="inherit" href="/" fontSize="18px">
        {newsletterTitle}
      </MuiLink>
    </Link>
    <StyledAutosizeInput
      value={fileName}
      onChange={onTitleChange}
      onBlur={onTitleBlur}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          e.target.blur();
        }
      }}
    />
  </StyledBreadCrumbs>
);
