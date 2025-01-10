import { useMemo, useState } from 'react';
import { Stack, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Chip, Menu, MenuItem, Grow } from '@mui/material';
import { createSx } from '@theme';
import { AggregationSummary } from '@components/home';
import dayjs from 'dayjs';
import { CommonQuery, DateQuery, DateQueryWithLabel } from '@types';
import { DateRangeWindow, Text, TrafficLevelChip } from '@components/common';
import { DateRange, Tag } from '@mui/icons-material';
import { trafficLevels } from '@constants';
import { TrafficLevel } from '@enums';
import { useNavigate } from 'react-router';
import { createSearchParams } from '@utils/queryUtils';

const sx = createSx({
  list: {
    pb: 0
  },
  listIcon: {
    minWidth: 32
  }
});

export const AggregationSummaryList = () => {
  const [selectingDate, setSelectingDate] = useState<HTMLDivElement | null>(null);
  const [selectingLevel, setSelectingLevel] = useState<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<null | number>(null);
  const navigate = useNavigate();

  const [dateQueryState, setDateQuery] = useState<DateQueryWithLabel>({
    label: 'Last 1 month',
    before: dayjs().valueOf(),
    after: dayjs().subtract(1, 'month').valueOf()
  });

  const dateQuery = useMemo<DateQuery>(() => ({
    before: dateQueryState.before,
    after: dateQueryState.after
  }), [dateQueryState]);

  const [commonQuery, setCommonQuery] = useState<CommonQuery>({
    level: null
  });

  const onChangeDateQuery = (set: DateQueryWithLabel | null) => {
    setSelectingDate(null);

    if (set !== null) {
      setDateQuery(set);
    }
  };

  const onChangeLevel = (level: TrafficLevel | null) => {
    setCommonQuery(prev => ({ ...prev, level }));
    setSelectingLevel(null);
  };

  const onOpenLevel = (e: React.MouseEvent<HTMLDivElement>) => {
    setWidth(e.currentTarget.clientWidth);
    setSelectingLevel(e.currentTarget);
  };

  return (
    <Stack gap={2}>
      <Paper variant='outlined'>
        <Text variant='h4' mt={0.5} component='h2' color='info' align='center'>Summary Options</Text>
        <List sx={sx.list}>
          <ListItem disablePadding>
            <ListItemButton onClick={e => setSelectingDate(e.currentTarget)}>
              <ListItemIcon sx={sx.listIcon}>
                <DateRange />
              </ListItemIcon>
              <ListItemText primary='Date Range' />
              <Chip label={dateQueryState.label} color='primary' size='small' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={onOpenLevel}>
              <ListItemIcon sx={sx.listIcon}>
                <Tag />
              </ListItemIcon>
              <ListItemText primary='Record Level' />
              <TrafficLevelChip size='small' level={commonQuery.level ?? null} />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>
      <AggregationSummary
        aggregation={{ field: 'ip', count: 5 }}
        common={commonQuery}
        date={dateQuery}
        onClick={data => navigate(`/catalog/${data.label}`)}
        label='Most common IPs'
        errorMessage='Unable to fetch most common IPs'
        emptyMessage={`No IP's found within given filters.`}
        displayLevels
      />
      <AggregationSummary
        aggregation={{ field: 'country', count: 5 }}
        common={commonQuery}
        date={dateQuery}
        onClick={data => navigate(`/catalog?${createSearchParams([{ country: data.label }])}`)}
        label='Most common countries'
        errorMessage='Unable to fetch most common countries'
        emptyMessage='No countries found within given filters.'
      />
      <AggregationSummary
        aggregation={{ field: 'application', count: 5 }}
        common={commonQuery}
        date={dateQuery}
        onClick={data => navigate(`/catalog?${createSearchParams([{ application: data.label }])}`)}
        label='Most common application'
        errorMessage='Unable to fetch most common application'
        emptyMessage='No application found within given filters.'
      />
      <Menu
        anchorEl={selectingLevel}
        open={!!selectingLevel}
        onClose={() => setSelectingLevel(null)}
        style={{ width: '100%' }}
        TransitionComponent={Grow}
        TransitionProps={{ timeout: 150 }}
      >
        {trafficLevels.map(option => (
          <MenuItem
            key={option.label}
            onClick={() => onChangeLevel(option.value)}
            selected={option.value === commonQuery.level}
            style={{ width: width ?? 'unset' }}
          >
            <ListItemText>{option.label}</ListItemText>
            <TrafficLevelChip level={option.value} size='small' />
          </MenuItem>
        ))}
      </Menu>
      <DateRangeWindow
        element={selectingDate}
        baseValues={dateQueryState}
        onChange={onChangeDateQuery}
        open={!!selectingDate}
        onClose={() => setSelectingDate(null)}
      />
    </Stack>
  );
};
