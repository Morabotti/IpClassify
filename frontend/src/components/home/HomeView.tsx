import { Box, Paper } from '@mui/material';
import { createSx } from '@theme';
import { ActiveAccessRecordChart } from '@components/home';

const sx = createSx({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: 2,
    padding: 2,
    width: '100%',
    height: '100%'
  },
  primaryArea: {
    display: 'grid',
    gridTemplateRows: '300px 1fr',
    gap: 2
  }
});

export const HomeView = () => {
  return (
    <Box sx={sx.grid}>
      <Box sx={sx.primaryArea}>
        <Paper variant='outlined'>
          <ActiveAccessRecordChart />
        </Paper>
        <Paper variant='outlined'>
          <Box>list</Box>
        </Paper>
      </Box>
      <Paper variant='outlined'>
        <Box>action</Box>
      </Paper>
    </Box>
  );
};
