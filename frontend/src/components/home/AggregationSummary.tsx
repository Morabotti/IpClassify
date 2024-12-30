import { accessApi } from '@client';
import { CenterMessage, Text } from '@components/common';
import { AppTable, AppTableHeader } from '@components/ui/table';
import { Client } from '@enums';
import { ErrorOutline, WarningAmberOutlined } from '@mui/icons-material';
import { Box, Paper, Skeleton, TableCell, TableRow } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AccessSummary, AggregationQuery, CommonQuery, DateQuery } from '@types';
import { getTextColor } from '@utils/uiUtils';

interface Props {
  aggregation: AggregationQuery;
  date: DateQuery;
  common: CommonQuery;
  label: string;
  errorMessage: string;
  emptyMessage: string;
  displayLevels?: boolean;
  onClick?: (set: AccessSummary) => void;
}

export const AggregationSummary = ({
  aggregation,
  date,
  common,
  label,
  onClick,
  displayLevels,
  errorMessage,
  emptyMessage
}: Props) => {
  const response = useQuery({
    queryKey: [Client.GetAccessSummary, date, aggregation, common],
    queryFn: () => accessApi.getSummary(date, aggregation, common)
  });

  if (response.isError) {
    return (
      <Paper variant='outlined'>
        <CenterMessage
          icon={ErrorOutline}
          title='Unable to load'
          text={errorMessage}
        />
      </Paper>
    );
  }

  if (!response.isFetching && response.data?.length === 0) {
    return (
      <Paper variant='outlined'>
        <CenterMessage
          icon={WarningAmberOutlined}
          title='Data not found'
          text={emptyMessage}
        />
      </Paper>
    );
  };

  return (
    <Paper variant='outlined'>
      <AppTable
        sx={{ borderRadius: 1 }}
        head={(
          <AppTableHeader
            disableSorting
            headCells={[
              { id: 'label', label: label },
              { id: 'count', label: 'Sum', align: 'right' }
            ]}
          />
        )}
      >
        {response.isFetching && [...new Array(aggregation.count ?? 10)].map((e, i) => (
          <TableRow hover={!!onClick} key={`row-loading-${i}`}>
            <TableCell><Skeleton width='70%' height={21} variant='text' /></TableCell>
            <TableCell>
              <Box display='flex' justifyContent='flex-end'>
                <Skeleton width='40%' height={21} variant='text' />
              </Box>
            </TableCell>
          </TableRow>
        ))}
        {(response.data ?? []).map(row => (
          <TableRow
            style={{ cursor: onClick ? 'pointer' : 'unset' }}
            hover={!!onClick}
            onClick={onClick ? () => onClick?.(row) : undefined}
            key={row.label}
          >
            <TableCell>
              <Text color={displayLevels ? getTextColor(row.level) : 'textPrimary'}>
                {row.label}
              </Text>
            </TableCell>
            <TableCell align='right'>{row.count}</TableCell>
          </TableRow>
        ))}
      </AppTable>
    </Paper>
  );
};
