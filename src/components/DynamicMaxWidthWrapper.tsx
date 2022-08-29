import styled from "@emotion/styled";

const maxWidth = 780;
const maxWidthMinusMargin = maxWidth - 32;

export const DynamicMaxWidthWrapper = styled.div`
  width: 100%;
  max-width: ${maxWidth}px;
  margin: 0 auto;
  @media (max-width: ${maxWidthMinusMargin}px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;
