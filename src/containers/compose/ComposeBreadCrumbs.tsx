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
    font-size: 16px;
    &:focus {
      border: 1px solid rgba(0, 0, 0, 0.23);
      outline: none;
    }
    &:disabled {
      color: unset;
      background-color: unset;
    }
  }
`;

export type ComposeBreadCrumbsProps = {
  newsletterId: string;
  newsletterTitle: string;
  fileName: string;
  disableEdit?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: any) => void;
};

export const ComposeBreadCrumbs: FC<ComposeBreadCrumbsProps> = ({
  newsletterId,
  newsletterTitle,
  fileName,
  disableEdit,
  onChange,
  onBlur,
}) => (
  <StyledBreadCrumbs aria-label="breadcrumb">
    <Link href={`/app/${newsletterId}`} passHref>
      <MuiLink underline="hover" color="inherit" href="/" fontSize="16px">
        {newsletterTitle}
      </MuiLink>
    </Link>
    <StyledAutosizeInput
      disabled={disableEdit}
      value={fileName}
      onChange={onChange}
      onBlur={onBlur}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          e.target.blur();
        }
      }}
    />
  </StyledBreadCrumbs>
);
