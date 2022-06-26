import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import { useRouter } from "next/router";
import { ChangeEvent, FC, MouseEvent, useState } from "react";

import { IssueWithStrippedDate } from "../../pages/app";
import { getTimeAgoString } from "../util/strings";

const StyledTableRow = styled(TableRow)`
  flex: 1;
  display: flex;
  width: 100%;
`;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string | Date },
  b: { [key in Key]: number | string | Date }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  id: keyof IssueWithStrippedDate;
  label: string;
  flex: number;
}

const headCells: readonly HeadCell[] = [
  {
    id: "title",
    label: "Title",
    flex: 7,
  },
];

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

interface EnhancedTableProps {
  headCells: readonly HeadCell[];
  order: Order;
  orderBy: string;
  onRequestSort: (
    event: MouseEvent,
    property: keyof IssueWithStrippedDate
  ) => void;
}

function EnhancedTableHead({
  headCells,
  order,
  orderBy,
  onRequestSort,
}: EnhancedTableProps) {
  const createSortHandler =
    (property: keyof IssueWithStrippedDate) => (event: MouseEvent) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <StyledTableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.id}
            style={{ flex: index === 0 ? 1 : "none" }}
            align={index === 0 ? "left" : "right"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
}

type Props = {
  newsletterId: string;
  issues: IssueWithStrippedDate[];
  sentAt?: boolean;
};

export const EnhancedTable: FC<Props> = ({ newsletterId, issues, sentAt }) => {
  const router = useRouter();

  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof IssueWithStrippedDate>(
    sentAt ? "sentAt" : "updatedAt"
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleOnClick = (issueId: string) => {
    router.push(`/app/compose?n=${newsletterId}&i=${issueId}`);
  };

  const handleRequestSort = (
    _: MouseEvent<unknown>,
    property: keyof IssueWithStrippedDate
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - issues.length) : 0;

  return (
    <Card variant="outlined">
      <TableContainer>
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headCells={[
              ...headCells,
              ...(sentAt ? [sentAtHeadCell] : [updatedAtHeadCell]),
            ]}
          />
          <TableBody>
            {issues
              .slice()
              .sort(getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((issue) => (
                <StyledTableRow
                  hover
                  key={issue.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOnClick(issue.id)}
                >
                  <TableCell component="th" scope="row" style={{ flex: 1 }}>
                    {issue.title}
                  </TableCell>
                  <TableCell align="right">
                    {getTimeAgoString(issue.updatedAt)}
                  </TableCell>
                </StyledTableRow>
              ))}
            {emptyRows > 0 && (
              <StyledTableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        count={issues.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
};
