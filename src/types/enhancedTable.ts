import { MouseEvent } from "react";

import { IssueWithStrippedDate, SubscriberWithStrippedDate } from "./stripDate";

export type Order = "asc" | "desc";

export type TableType = "drafts" | "sentIssues" | "subscribers";

export type HeadCellType =
  | "title"
  | "email"
  | "updatedAt"
  | "sentAt"
  | "addedAt";

export const DefaultOrderBy: Record<TableType, HeadCellType> = {
  drafts: "updatedAt",
  sentIssues: "sentAt",
  subscribers: "updatedAt",
};

type HeadCell = {
  id: HeadCellType;
  label: string;
  flex: number;
};

const titleHeadCell: HeadCell = {
  id: "title",
  label: "Title",
  flex: 7,
};

const nameHeadCell: HeadCell = {
  id: "email",
  label: "Email",
  flex: 7,
};

const updatedAtHeadCell: HeadCell = {
  id: "updatedAt",
  label: "Updated",
  flex: 1,
};

const sentAtHeadCell: HeadCell = {
  id: "sentAt",
  label: "Sent",
  flex: 1,
};

const addedAtHeadCell: HeadCell = {
  id: "sentAt",
  label: "Sent",
  flex: 1,
};

export const HeadCells: Record<TableType, readonly HeadCell[]> = {
  drafts: [titleHeadCell, updatedAtHeadCell],
  sentIssues: [titleHeadCell, sentAtHeadCell],
  subscribers: [nameHeadCell, addedAtHeadCell],
};

export type EnhancedTableHeadProps = {
  headCells: readonly HeadCell[];
  order: Order;
  orderBy: string;
  onRequestSort: (event: MouseEvent, property: HeadCellType) => void;
};

export type EnhancedTableProps = {
  type: TableType;
  items: IssueWithStrippedDate[] | SubscriberWithStrippedDate[];
  onItemClick: (
    item: IssueWithStrippedDate | SubscriberWithStrippedDate
  ) => void;
};
