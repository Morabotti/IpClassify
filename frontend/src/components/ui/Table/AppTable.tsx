import { Table, TableBody, TableContainer, TableHead } from '@mui/material';
import { createSx, MaterialSxProps } from '@theme';

const internalSx = createSx({
  tableContainer: {
    bgcolor: t => t.palette.background.paper,
    flexGrow: 1,
    '& tbody > tr > td': {
      py: 1,
      px: 1.5
    },
    '& td.MuiTableCell-paddingCheckbox': {
      py: 0,
      pr: 0
    }
  }
});

interface Props {
  head?: React.ReactNode;
  children?: React.ReactNode;
  size?: 'small' | 'medium';
  sx?: MaterialSxProps;
}

export const AppTable: React.FC<Props> = ({
  head,
  children,
  sx,
  size = 'medium'
}: Props) => {
  return (
    <TableContainer
      sx={[internalSx.tableContainer, sx] as MaterialSxProps}
    >
      <Table size={size}>
        <TableHead>{head}</TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};
