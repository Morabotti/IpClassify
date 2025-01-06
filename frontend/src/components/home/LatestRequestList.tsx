import { Box, Button, Divider, Paper, Skeleton, Stack, TableCell, TableRow } from '@mui/material';
import { createSx } from '@theme';
import { useQuery } from '@tanstack/react-query';
import { Client, TrafficLevel } from '@enums';
import { accessApi } from '@client';
import { useNotification, useOrder, usePagination, useSimpleContextMenu } from '@hooks';
import { AccessRecord, DateQuery, IpClassifyRequest } from '@types';
import { emptyDateQuery } from '@constants';
import { Text } from '@components/common';
import { ChevronRight, Refresh } from '@mui/icons-material';
import { AppTable, AppTableHeader } from '@components/ui/table';
import dayjs from 'dayjs';
import { getTextColor } from '@utils/uiUtils';
import { getTrafficLevel } from '@utils/dataUtils';
import clsx from 'clsx';
import { Link, useNavigate } from 'react-router';
import { AccessRecordContextMenu } from '@components/common';
import { createSearchParams } from '@utils/queryUtils';
import { useAtom } from 'jotai';
import { loadingAtom } from '@atoms';
import { useState } from 'react';

const sx = createSx({
  paper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  link: {
    textDecoration: 'none'
  }
});

export const LatestRequestList = () => {
  const [loading, setLoading] = useAtom(loadingAtom);
  const pagination = usePagination({ defaultPage: 0, defaultRows: 30 });
  const sort = useOrder<AccessRecord>('createdAt', false, 'DESC');
  const [dateQuery, setDateQuery] = useState<DateQuery>({ ...emptyDateQuery, before: dayjs().valueOf() });
  const contextMenu = useSimpleContextMenu<AccessRecord>();
  const { createNotification } = useNotification();
  const navigate = useNavigate();

  const response = useQuery({
    queryKey: [Client.GetAccessRecords, pagination.toQuery, sort.toQuery, dateQuery, {}, {}],
    queryFn: () => accessApi.getAll(pagination.toQuery, sort.toQuery, dateQuery, {}, {})
  });

  const onClassify = async (set: IpClassifyRequest) => {
    setLoading(true);

    try {
      await accessApi.updateIpClassification(set);
      createNotification('Successfully updated classification', 'success');
      response.refetch();
    }
    catch (e) {
      createNotification('Failed to update classification', 'error');
    }

    setLoading(false);
  };

  const onRefresh = () => {
    setDateQuery({ ...emptyDateQuery, before: dayjs().valueOf() });
  };

  return (
    <Paper variant='outlined' sx={sx.paper}>
      <Stack py={1} px={2} direction='row' justifyContent='space-between' gap={2} alignItems='center'>
        <Text variant='h4' component='h2' color='info' align='center'>Latest Requests</Text>
        <Box display='flex' gap={2}>
          <Button
            variant='outlined'
            startIcon={<Refresh />}
            onClick={onRefresh}
            disabled={response.isFetching || loading}
          >
            Refresh
          </Button>
          <Button
            variant='outlined'
            endIcon={<ChevronRight />}
            disabled={response.isFetching || loading}
            component={Link}
            to='/catalog'
          >
            Show more
          </Button>
        </Box>
      </Stack>
      <Divider />
      <AppTable
        sx={{ height: 100, overflowX: 'auto' }}
        stickyHeader
        head={(
          <AppTableHeader<AccessRecord>
            headCells={[
              { id: 'ip', label: 'IP' },
              { id: 'createdAt', label: 'Logged at' },
              { id: 'application', label: 'Application' },
              { id: 'method', label: 'Target' },
              { id: 'country', label: 'Country' },
              { id: 'city', label: 'City' },
              { id: 'isp', label: 'ISP' }
            ]}
          />
        )}
      >
        {response.isFetching && [...new Array(pagination.rows ?? 10)].map((e, i) => (
          <TableRow hover key={`row-loading-${i}`}>
            <TableCell><Skeleton width='70%' height={21} variant='text' /></TableCell>
            <TableCell><Skeleton width='70%' height={21} variant='text' /></TableCell>
            <TableCell><Skeleton width='70%' height={21} variant='text' /></TableCell>
            <TableCell><Skeleton width='70%' height={21} variant='text' /></TableCell>
            <TableCell><Skeleton width='70%' height={21} variant='text' /></TableCell>
            <TableCell><Skeleton width='70%' height={21} variant='text' /></TableCell>
            <TableCell><Skeleton width='70%' height={21} variant='text' /></TableCell>
          </TableRow>
        ))}
        {(response.data?.result ?? []).map(record => {
          const level = getTrafficLevel(record);

          return (
            <TableRow
              hover
              key={record.id}
              className={clsx({
                error: level === TrafficLevel.DANGER,
                warning: level === TrafficLevel.WARNING
              })}
              onContextMenu={contextMenu.onMenu(record, false)}
            >
              <TableCell>
                <Text
                  color={getTextColor(level)}
                  fontWeight={500}
                  component={Link}
                  to={`/catalog/${record.ip}`}
                  sx={sx.link}
                >
                  {record.ip}
                </Text>
              </TableCell>
              <TableCell>{dayjs.unix(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
              <TableCell>{record.application}</TableCell>
              <TableCell>{record.method} {record.path}</TableCell>
              <TableCell>{record.country}</TableCell>
              <TableCell>{record.city}</TableCell>
              <TableCell>{record.isp}</TableCell>
            </TableRow>
          );
        })}
      </AppTable>
      <AccessRecordContextMenu
        contextMenu={contextMenu.menu}
        onClose={contextMenu.onClose}
        onClassify={onClassify}
        onFilter={({ ip }) => navigate(`/catalog?${createSearchParams([{ ip }])}`)}
        onView={(set) => navigate(`/catalog/${set.ip}`)}
      />
    </Paper>
  );
};
