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
import { ChangeEvent, FC, MouseEvent, useState } from "react";

import {
  DefaultOrderBy,
  EnhancedTableHeadProps,
  EnhancedTableProps,
  getComparator,
  getItemValues,
  HeadCells,
  HeadCellType,
  Order,
} from "../types/enhancedTable";
import {
  IssueWithStrippedDate,
  SubscriberWithStrippedDate,
} from "../types/stripDate";

export const StyledTableRow = styled(TableRow)`
  flex: 1;
  display: flex;
  width: 100%;
`;

export const EnhancedTableHead: FC<EnhancedTableHeadProps> = ({
  headCells,
  order,
  orderBy,
  onRequestSort,
}) => {
  const createSortHandler = (property: HeadCellType) => (event: MouseEvent) => {
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
};

export const EnhancedTable: FC<EnhancedTableProps> = ({
  type,
  items,
  onItemClick,
}) => {
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<HeadCellType>(DefaultOrderBy[type]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (
    _: MouseEvent<unknown>,
    property: HeadCellType
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - items.length) : 0;

  return (
    <Card variant="outlined">
      <TableContainer>
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headCells={HeadCells[type]}
          />
          <TableBody>
            {items
              .slice()
              .sort(getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(
                (item: IssueWithStrippedDate | SubscriberWithStrippedDate) => (
                  <StyledTableRow
                    hover
                    key={item.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => onItemClick(item)}
                  >
                    <TableCell component="th" scope="row" style={{ flex: 1 }}>
                      {getItemValues(item, type)[0]}
                    </TableCell>
                    <TableCell align="right">
                      {getItemValues(item, type)[1]}
                    </TableCell>
                  </StyledTableRow>
                )
              )}
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
        count={items.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
};
