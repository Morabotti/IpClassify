import { accessApi } from '@client';
import { AppTable, AppTableHeader, AppTableNavigation } from '@components/ui/table';
import { Client } from '@enums';
import { useControls, useOrder } from '@hooks';
import { Paper } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createSx } from '@theme';
import { AccessRecord, AccessRecordQuery } from '@types';
import { clamp } from '@utils/dataUtils';
import { useMemo } from 'react';
import { LatestRequestTableRow } from './LatestRequestTableRow';

const sx = createSx({
  container: {
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  }
});

interface Props {
  ip: string | null;
  loading?: boolean;
}

export const DetailsLatestRequests = ({ ip, loading }: Props) => {
  const order = useOrder<AccessRecord>('createdAt', true, 'DESC');
  const controls = useControls({ defaultRows: 20 });

  const query = useMemo<AccessRecordQuery>(() => ({ ip: ip ?? null }), [ip]);

  const response = useQuery({
    queryKey: [Client.GetAccessRecords, controls.toQuery, order.toQuery, {}, {}, query],
    queryFn: () => accessApi.getAll(controls.toQuery, order.toQuery, {}, {}, query),
    placeholderData: keepPreviousData,
    enabled: !loading && !!ip
  });

  return (
    <Paper sx={sx.container} variant='outlined'>
      <AppTable
        sx={{ overflowX: 'auto' }}
        stickyHeader
        size='small'
        head={(
          <AppTableHeader<AccessRecord>
            onRequestSort={order.onSort}
            order={order.order}
            orderBy={order.orderBy}
            rowCount={response.data?.count ?? 0}
            loading={loading || ip === null}
            headCells={[
              { id: 'id', label: 'Request ID' },
              { id: 'createdAt', label: 'Logged at', minWidth: 170 },
              { id: 'application', label: 'Application' },
              { id: 'method', label: 'Target' },
              { id: 'userAgent', label: 'User agent' }
            ]}
          />
        )}
      >
        {(response.isFetching || loading || ip === null) && [...new Array(clamp(controls.rows ?? 10, 5, 35))].map((e, i) => (
          <LatestRequestTableRow record={null} key={`row-loading-${i}`} />
        ))}
        {(response.data?.result ?? []).map(record => (
          <LatestRequestTableRow
            key={record.id}
            record={record}
          />
        ))}
      </AppTable>
      <AppTableNavigation
        length={response.data?.count ?? 0}
        onChangePage={controls.onChangePage}
        onChangeRows={controls.onChangeRows}
        page={controls.page}
        rows={controls.rows}
      />
    </Paper>
  );
};
