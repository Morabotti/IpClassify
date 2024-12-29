import { Box, Pagination, Paper } from '@mui/material';
import { MaterialSxProps, createSx } from '@theme';
import { PaginationRowSelectorButton } from '@components/ui/Table';
import { Text } from '@components/common';

const internalSx = createSx({
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 2,
    alignItems: 'center'
  },
  buttons: {
    '& button': {
      bgcolor: 'common.white'
    }
  }
});

interface Props {
  sx?: MaterialSxProps;
  rows: number;
  page: number;
  length: number;
  minimal?: boolean;
  onChangeRows: (set: number) => void;
  onChangePage: (set: number) => void;
}

export const AppTableNavigation: React.FC<Props> = ({
  sx,
  length,
  onChangePage,
  onChangeRows,
  minimal = false,
  page,
  rows
}: Props) => {
  return (
    <Paper square sx={[internalSx.navigation, sx] as MaterialSxProps}>
      <Box>
        <PaginationRowSelectorButton
          onChange={onChangeRows}
          rows={rows}
          sx={{ bgcolor: 'common.white' }}
        />
      </Box>
      <Text variant='body1' color='text.secondary'>
        {`${(page * rows) - rows + 1} - ${page * rows > length ? length : page * rows} of ${length} items`}
      </Text>
      <Box>
        {minimal ? (
          <Pagination
            count={Math.ceil(length / rows) || 1}
            shape='rounded'
            page={page}
            variant='outlined'
            onChange={(e, v) => onChangePage(v)}
            sx={internalSx.buttons}
            hidePrevButton
            hideNextButton
          />
        ) : (
          <Pagination
            count={Math.ceil(length / rows) || 1}
            shape='rounded'
            page={page}
            variant='outlined'
            onChange={(e, v) => onChangePage(v)}
            sx={internalSx.buttons}
            showFirstButton
            showLastButton
          />
        )}
      </Box>
    </Paper>
  );
};
