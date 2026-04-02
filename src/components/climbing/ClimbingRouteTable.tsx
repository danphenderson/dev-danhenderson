import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { CommonLink, COMMON_LINK_TOOLTIP_ID } from '../CommonLink';
import type { TickRow, TodoRow } from '../../types/data';

type ClimbingRouteRow = TickRow | TodoRow;

type ClimbingRouteTableProps = {
  rows: ClimbingRouteRow[];
  ariaLabel: string;
  emptyMessage: string;
};

const rowsPerPageOptions = [5, 10, 25, 50];
const defaultRowsPerPage = 10;

const renderRouteLink = (label: string, href: string) => (
  <CommonLink
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    underline="hover"
    data-tooltip-id={COMMON_LINK_TOOLTIP_ID}
    data-tooltip-content={`Open ${label} on Mountain Project.`}
    data-tooltip-place="top"
  >
    {label}
  </CommonLink>
);

export function ClimbingRouteTable({ rows, ariaLabel, emptyMessage }: ClimbingRouteTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  useEffect(() => {
    setPage(0);
  }, [rows]);

  const visibleRows = useMemo(() => {
    const start = page * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [page, rows, rowsPerPage]);

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Table size="small" aria-label={ariaLabel}>
          <TableHead>
            <TableRow>
              <TableCell>Route</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.length ? (
              visibleRows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{renderRouteLink(row.route, row.url)}</TableCell>
                  <TableCell>{row.grade}</TableCell>
                  <TableCell>{row.location}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>{emptyMessage}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(_event, nextPage) => setPage(nextPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number.parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </Box>
  );
}
