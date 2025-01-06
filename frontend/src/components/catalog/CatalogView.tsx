import { Paper, Stack } from '@mui/material';
import { CatalogFilters, CatalogTableRow } from '@components/catalog';
import { accessRecordTagsOptions } from '@constants';
import { useControls, useDebounce, useNotification, useOrder, useQuerySync, useQueryValues, useSimpleContextMenu, useTagFilters } from '@hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Client } from '@enums';
import { accessApi } from '@client';
import { AccessRecord, IpClassifyRequest } from '@types';
import { clamp, tagsToAccessRecordQuery, tagsToCommonQuery, tagsToDateQuery, toTagOptions } from '@utils/dataUtils';
import { AppTable, AppTableHeader, AppTableNavigation } from '@components/ui/table';
import { createSx } from '@theme';
import { AccessRecordContextMenu } from '@components/common';
import { useSetAtom } from 'jotai';
import { loadingAtom } from '@atoms';
import { useNavigate } from 'react-router';

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
  const setLoading = useSetAtom(loadingAtom);
  const queryValues = useQueryValues({ search: '' });
  const [search, setSearch] = useState(queryValues?.search);
  const controls = useControls();
  const order = useOrder<AccessRecord>('createdAt', true, 'DESC');
  const debouncedSearch = useDebounce(search, 250);
  const updated = useRef(false);
  const contextMenu = useSimpleContextMenu<AccessRecord>();
  const navigate = useNavigate();
  const { createNotification } = useNotification();
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

  const metadata = useQuery({
    queryKey: [Client.GetAccessMetadata],
    queryFn: () => accessApi.getMetadata()
  });

  useEffect(() => {
    if (metadata.data && !updated.current) {
      updated.current = true;
      tags.onAddOptions('application', toTagOptions(metadata.data.applications ?? []));
      tags.onAddOptions('country', toTagOptions(metadata.data.countries ?? []));
      tags.onAddOptions('city', toTagOptions(metadata.data.cities ?? []));
      tags.onAddOptions('timezone', toTagOptions(metadata.data.timezones ?? []));
    }
  }, [metadata.data, tags]);

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
                { id: 'timezone', label: 'Timezone' },
                { id: 'country', label: 'Country' },
                { id: 'city', label: 'City' },
                { id: 'isp', label: 'ISP', disableSorting: true },
                { id: 'id', label: 'Attributes', disableSorting: true, align: 'right' }
              ]}
            />
          )}
        >
          {response.isFetching && [...new Array(clamp(controls.rows ?? 10, 5, 35))].map((e, i) => (
            <CatalogTableRow record={null} key={`row-loading-${i}`} />
          ))}
          {(response.data?.result ?? []).map(record => (
            <CatalogTableRow
              key={record.id}
              record={record}
              onContextMenu={contextMenu.onMenu(record, false)}
              selected={contextMenu.menu?.item?.id === record.id && contextMenu.menu.open}
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
      <AccessRecordContextMenu
        contextMenu={contextMenu.menu}
        onClose={contextMenu.onClose}
        onClassify={onClassify}
        onFilter={({ ip }) => tags.onSubmitEntryValue({ key: 'ip', value: ip })}
        onView={(set) => navigate(`/catalog/${set.ip}`)}
      />
    </Stack>
  );
};
