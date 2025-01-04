import { Table, TableBody, tableCellClasses, TableContainer, TableHead } from '@mui/material';
import { createSx, MaterialSxProps, orange, red, selector } from '@theme';

const _sx = createSx({
  tableContainer: {
    bgcolor: t => t.palette.background.paper,
    flexGrow: 1,
    '& tbody > tr > td': {
      py: 1,
      px: 2
    },
    [selector.onChildElement('td', tableCellClasses.paddingCheckbox)]: {
      py: 0,
      pr: 0
    },
    [selector.onChildElement('tr', 'error')]: {
      bgcolor: red[50],
      '&:hover': {
        bgcolor: 'hsl(0, 96%, 95%)'
      }
    },
    [selector.onChildElement('tr', 'warning')]: {
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
      sx={[_sx.tableContainer, sx] as MaterialSxProps}
    >
      <Table size={size} stickyHeader={stickyHeader}>
        <TableHead>{head}</TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};
