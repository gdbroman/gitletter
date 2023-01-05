import type { MouseEvent } from "react";

import { getTimeAgoString } from "../../util/strings";
import type {
  IssueWithParsedTitleAndStrippedDate,
  SubscriberWithStrippedDate,
} from "./stripDate";

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
  subscribers: "addedAt",
};

export const getItemValues = (item: any, type: TableType) => {
  switch (type) {
    case "drafts":
      return [item.title, getTimeAgoString(item.updatedAt)];
    case "sentIssues":
      return [item.title, getTimeAgoString(item.sentAt)];
    case "subscribers":
      return [item.email, getTimeAgoString(item.addedAt)];
  }
};

type HeadCell = {
  id: HeadCellType;
  label: string;
  flex: number;
};

const fileNameHeadCell: HeadCell = {
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
  id: "addedAt",
  label: "Added",
  flex: 1,
};

export const HeadCells: Record<TableType, readonly HeadCell[]> = {
  drafts: [fileNameHeadCell, updatedAtHeadCell],
  sentIssues: [fileNameHeadCell, sentAtHeadCell],
  subscribers: [nameHeadCell, addedAtHeadCell],
};

export type EnhancedTableHeadProps = {
  headCells: readonly HeadCell[];
  order: Order;
  orderBy: string;
  onRequestSort: (event: MouseEvent, property: HeadCellType) => void;
};

type ItemType<T extends TableType> = T extends "subscribers"
  ? SubscriberWithStrippedDate
  : IssueWithParsedTitleAndStrippedDate;

export type EnhancedTableProps<T extends TableType> = {
  type: T;
  items: ItemType<T>[];
  disablePagination?: boolean;
  onItemClick?: (item: ItemType<T>) => void;
  onItemDuplicate?: (item: ItemType<T>) => void;
  onItemDelete: (item: ItemType<T>) => void;
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(
  order: Order,
  orderBy: HeadCellType
): (
  a: { [K in HeadCellType]?: string },
  b: { [K in HeadCellType]?: string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
