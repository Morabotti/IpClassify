import { useMemo } from 'react';
import { HeadCell, TableOrder, CustomCell } from '@types';
import { KeyboardArrowDown } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import { TableRow, TableCell, TableSortLabel, Checkbox, Box, Tooltip, tableSortLabelClasses } from '@mui/material';
import { MaterialSxProps, createSx, gray, selector } from '@theme';

const sx = createSx({
  tr: {
    '& > th': {
      px: 2,
      borderRight: 'unset'
    }
  },
  bg: {
    fontWeight: 600,
    color: theme => theme.palette.text.secondary,
    backgroundColor: gray[100],
    borderColor: gray[200]
  },
  checkbox: {
    p: 0.75
  },
  sortLabel: {
    color: 'text.secondary',
    fontWeight: 600,
    '&:hover': { color: 'text.primary' },
    [selector.on(tableSortLabelClasses.active)]: {
      color: 'text.secondary',
      '&:hover': { color: 'text.primary' }
    }
  }
});

interface Props<T> {
  headCells: (false | HeadCell<T> | CustomCell)[];
  order?: TableOrder;
  orderBy?: string;
  loading?: boolean;
  disableSorting?: boolean;
  numSelected?: number;
  rowCount?: number;
  showCheckbox?: boolean;
  showActions?: boolean;
  sxTr?: MaterialSxProps;
  sxCell?: MaterialSxProps;
  onSelectAll?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRequestSort?: (event: React.MouseEvent<unknown>, property: keyof T) => void;
}

export function AppTableHeader<T>({
  headCells,
  orderBy,
  order = 'ASC',
  numSelected,
  rowCount = 0,
  showActions = false,
  showCheckbox = false,
  disableSorting = false,
  loading = false,
  sxTr = {},
  sxCell = {},
  onSelectAll,
  onRequestSort
}: Props<T>): React.ReactNode {
  const sortHandler = (property: unknown) => (e: React.MouseEvent<unknown>) => {
    onRequestSort?.(e, property as keyof T);
  };

  const cells = useMemo(
    () => (headCells as (HeadCell<T> | CustomCell)[]).filter(i => !!i),
    [headCells]
  );

  return (
    <TableRow sx={[sx.tr, sxTr] as MaterialSxProps}>
      {showCheckbox && onSelectAll !== undefined && numSelected !== undefined && (
        <TableCell
          padding='checkbox'
          sx={[sx.bg, sxCell] as MaterialSxProps}
        >
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected !== 0 && numSelected === rowCount}
            onChange={onSelectAll}
            color='info'
            sx={sx.checkbox}
            inputProps={{ 'aria-label': 'select all items' }}
          />
        </TableCell>
      )}
      {cells.map((headCell, index) => (
        <TableCell
          key={index}
          align={headCell?.align ?? 'left'}
          width={headCell.width}
          padding={headCell.padding ?? 'normal'}
          colSpan={headCell.span ?? 1}
          sx={[
            sx.bg,
            { borderRight: index !== cells.length - 1 ? '1px solid' : undefined },
            (headCell.padding === 'none' ? { p: 0 } : { px: 2, py: 1 }),
            (!!headCell.minWidth && { minWidth: headCell.minWidth }),
            sxCell
          ] as MaterialSxProps}
          sortDirection={!headCell.disableSorting
            ? (orderBy === headCell.id ? order.toLocaleLowerCase() as ('asc' | 'desc') : false)
            : undefined}
        >
          <Tooltip
            title={headCell.longLabel}
            placement='bottom'
            disableFocusListener={!headCell.longLabel}
            disableHoverListener={!headCell.longLabel}
            disableInteractive={!headCell.longLabel}
            disableTouchListener={!headCell.longLabel}
          >
            {disableSorting || headCell.disableSorting ? (
              <Box>{headCell.label}</Box>
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={order.toLowerCase() as 'asc' | 'desc'}
                onClick={sortHandler(headCell.id)}
                disabled={loading}
                IconComponent={KeyboardArrowDown}
                sx={sx.sortLabel}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box sx={visuallyHidden}>
                    {order === 'DESC' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </Tooltip>
        </TableCell>
      ))}
      {showActions && (
        <TableCell
          padding='none'
          sx={[sx.bg, sxCell] as MaterialSxProps}
        />
      )}
    </TableRow>
  );
}
