import { Box, Pagination, Paper } from '@mui/material';
import { MaterialSxProps, createSx, gray } from '@theme';
import { PaginationRowSelectorButton } from '@components/ui/table';
import { Text } from '@components/common';

const _sx = createSx({
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 2,
    alignItems: 'center',
    py: 1,
    px: 2,
    color: theme => theme.palette.text.secondary,
    backgroundColor: gray[100],
    borderTop: `1px solid ${gray[200]}`
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
    <Paper square sx={[_sx.navigation, sx] as MaterialSxProps}>
      <Box>
        <PaginationRowSelectorButton
          onChange={onChangeRows}
          rows={rows}
          sx={{ bgcolor: 'common.white' }}
        />
      </Box>
      <Text variant='body1' color='text.secondary'>
        {`${page * rows + 1} - ${(page * rows + rows) > length ? length : (page * rows + rows)} of ${length} items`}
      </Text>
      <Box>
        {minimal ? (
          <Pagination
            count={Math.ceil(length / rows) || 1}
            shape='rounded'
            page={page + 1}
            variant='outlined'
            onChange={(e, v) => onChangePage(v - 1)}
            sx={_sx.buttons}
            hidePrevButton
            hideNextButton
          />
        ) : (
          <Pagination
            count={Math.ceil(length / rows) || 1}
            shape='rounded'
            page={page + 1}
            variant='outlined'
            onChange={(e, v) => onChangePage(v - 1)}
            sx={_sx.buttons}
            showFirstButton
            showLastButton
          />
        )}
      </Box>
    </Paper>
  );
};
