import { Table, TableBody, TableContainer, TableHead } from '@mui/material';
import { createSx, MaterialSxProps, orange, red } from '@theme';

const internalSx = createSx({
  tableContainer: {
    bgcolor: t => t.palette.background.paper,
    flexGrow: 1,
    '& tbody > tr > td': {
      py: 1,
      px: 2
    },
    '& td.MuiTableCell-paddingCheckbox': {
      py: 0,
      pr: 0
    },
    ['& tr.error']: {
      bgcolor: red[50],
      '&:hover': {
        bgcolor: 'hsl(0, 96%, 95%)'
      }
    },
    ['& tr.warning']: {
      bgcolor: orange[50],
      '&:hover': {
        bgcolor: 'hsl(45, 96%, 94%)'
      }
    }
  }
});

interface Props {
  head?: React.ReactNode;
  children?: React.ReactNode;
  stickyHeader?: boolean;
  size?: 'small' | 'medium';
  sx?: MaterialSxProps;
}

export const AppTable: React.FC<Props> = ({
  head,
  children,
  stickyHeader,
  sx,
  size = 'medium'
}: Props) => {
  return (
    <TableContainer
      sx={[internalSx.tableContainer, sx] as MaterialSxProps}
    >
      <Table size={size} stickyHeader={stickyHeader}>
        <TableHead>{head}</TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};
