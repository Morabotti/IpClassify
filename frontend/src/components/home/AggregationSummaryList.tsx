import { Stack, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { createSx } from '@theme';
import { AggregationSummary } from '@components/home';
import dayjs from 'dayjs';
import { useState } from 'react';
import { CommonQuery, DateQueryWithLabel } from '@types';
import { Text, TrafficLevelChip } from '@components/common';
import { DateRange, Tag } from '@mui/icons-material';

const sx = createSx({
  paper: {

  },
  list: {
    pb: 0
  },
  listIcon: {
    minWidth: 32
  }
});

export const AggregationSummaryList = () => {
  const [dateQuery] = useState<DateQueryWithLabel>({
    label: 'Last month',
    before: dayjs().valueOf(),
    after: dayjs().subtract(1, 'month').valueOf()
  });

  const [commonQuery] = useState<CommonQuery>({
    level: null
  });

  return (
    <Stack gap={2}>
      <Paper variant='outlined' sx={sx.paper}>
        <Text variant='h4' component='h2' color='info' align='center'>Summary Options</Text>
        <List sx={sx.list}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon sx={sx.listIcon}>
                <DateRange />
              </ListItemIcon>
              <ListItemText primary='Date Range' />
              <Chip label={dateQuery.label} color='primary' size='small' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
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
        onClick={data => console.log(data)}
        label='Most common IPs'
        errorMessage='Unable to fetch most common IPs'
        emptyMessage={`No IP's found within given filters.`}
      />
      <AggregationSummary
        aggregation={{ field: 'country', count: 5 }}
        common={commonQuery}
        date={dateQuery}
        label='Most common countries'
        errorMessage='Unable to fetch most common countries'
        emptyMessage='No countries found within given filters.'
      />
      <AggregationSummary
        aggregation={{ field: 'application', count: 5 }}
        common={commonQuery}
        date={dateQuery}
        label='Most common application'
        errorMessage='Unable to fetch most common application'
        emptyMessage='No application found within given filters.'
      />
    </Stack>
  );
};
