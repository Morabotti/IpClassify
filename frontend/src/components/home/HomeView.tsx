import { Box, Paper } from '@mui/material';
import { createSx } from '@theme';
import { ActiveAccessRecordChart, AggregationSummaryList, LatestRequestList, TrafficActions } from '@components/home';

const sx = createSx({
  layout: {
    display: 'grid',
    gridTemplateColumns: '330px 1fr',
    width: '100%',
    height: '100%'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: 2,
    padding: 2,
    width: '100%',
    height: '100%'
  },
  primaryArea: {
    display: 'grid',
    gridTemplateRows: '300px 1fr',
    gap: 2,
    height: '100%'
  },
  actions: {
    borderTop: 'none',
    borderBottom: 'none'
  }
});

export const HomeView = () => {
  return (
    <Box sx={sx.layout}>
      <Paper square variant='outlined' sx={sx.actions}>
        <TrafficActions />
      </Paper>
      <Box sx={sx.grid}>
        <Box sx={sx.primaryArea}>
          <Paper variant='outlined'>
            <ActiveAccessRecordChart />
          </Paper>
          <LatestRequestList />
        </Box>
        <AggregationSummaryList />
      </Box>
    </Box>
  );
};
