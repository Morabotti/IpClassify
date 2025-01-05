import { Paper, Stack } from '@mui/material';
import { CatalogFilters, CatalogTableRow } from '@components/catalog';
import { accessRecordTagsOptions } from '@constants';
import { useControls, useDebounce, useOrder, useQuerySync, useQueryValues, useTagFilters } from '@hooks';
import { useMemo, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Client } from '@enums';
import { accessApi } from '@client';
import { AccessRecord } from '@types';
import { tagsToAccessRecordQuery, tagsToCommonQuery, tagsToDateQuery } from '@utils/dataUtils';
import { AppTable, AppTableHeader, AppTableNavigation } from '@components/ui/table';
import { createSx } from '@theme';

const sx = createSx({
  container: {
    m: 2,
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  }
});

export const CatalogView = () => {
  const queryValues = useQueryValues({ search: '' });
  const [search, setSearch] = useState(queryValues?.search);
  const controls = useControls();
  const order = useOrder<AccessRecord>('createdAt', true, 'DESC');
  const debouncedSearch = useDebounce(search, 250);
  useQuerySync({ search: debouncedSearch });

  const tags = useTagFilters({
    options: accessRecordTagsOptions,
    defaultEntries: [{ id: 'createdAt' }]
  });

  const commonQuery = useMemo(() => tagsToCommonQuery(tags.queryParams, debouncedSearch), [tags.queryParams, debouncedSearch]);
  const dateQuery = useMemo(() => tagsToDateQuery(tags.queryParams), [tags.queryParams]);
  const accessQuery = useMemo(() => tagsToAccessRecordQuery(tags.queryParams), [tags.queryParams]);

  const response = useQuery({
    queryKey: [Client.GetAccessRecords, controls.toQuery, order.toQuery, dateQuery, commonQuery, accessQuery],
    queryFn: () => accessApi.getAll(controls.toQuery, order.toQuery, dateQuery, commonQuery, accessQuery),
    placeholderData: keepPreviousData
  });

  return (
    <Stack height='100%'>
      <CatalogFilters
        search={search}
        tagEntries={tags.entries}
        defaultTagEntries={tags.defaultEntries}
        tagOptions={tags.tagOptions}
        tagValues={tags.tagValues}
        onAddEntry={tags.onAddEntry}
        onDeleteEntry={tags.onDeleteEntry}
        onSubmitValues={tags.onSubmitValues}
        onUpdateEntry={tags.onUpdateEntry}
        onSearchChange={setSearch}
      />
      <Paper sx={sx.container} variant='outlined'>
        <AppTable
          sx={{ overflowX: 'auto' }}
          stickyHeader
          head={(
            <AppTableHeader<AccessRecord>
              onRequestSort={order.onSort}
              order={order.order}
              orderBy={order.orderBy}
              rowCount={response.data?.count ?? 0}
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
          {response.isFetching && [...new Array(controls.rows ?? 10)].map((e, i) => (
            <CatalogTableRow record={null} key={`row-loading-${i}`} />
          ))}
          {(response.data?.result ?? []).map(record => (
            <CatalogTableRow record={record} key={record.id} />
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
    </Stack>
  );
};
