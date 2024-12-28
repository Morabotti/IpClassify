import { trafficSummaryAtom } from '@atoms';
import { Box, Skeleton } from '@mui/material';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import { CartesianGrid, XAxis, YAxis, ResponsiveContainer, AreaChart, Tooltip, Area } from 'recharts';

export const ActiveAccessRecordChart = () => {
  const trafficSummary = useAtomValue(trafficSummaryAtom);
  const hour = dayjs().hour();

  if (trafficSummary === null) {
    return (
      <Box p={1} height='100%'>
        <Skeleton width='100%' variant='rectangular' height='100%' />
      </Box>
    );
  }

  return (
    <div>
      <ResponsiveContainer height={300} width='100%'>
        <AreaChart
          data={trafficSummary}
          margin={{ top: 20, right: 30, left: -25, bottom: 0 }}
        >
          <defs>
            <linearGradient id='colorNormal' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#82ca9d' stopOpacity={0} />
            </linearGradient>
            <linearGradient id='colorWarning' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#cac982' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#cac282' stopOpacity={0} />
            </linearGradient>
            <linearGradient id='colorDanger' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#ca8282' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#ca8282' stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type='monotone'
            name='Normal'
            dataKey='normal'
            stroke='#007810'
            strokeWidth={1}
            isAnimationActive={false}
            fill='url(#colorNormal)'
          />
          <Area
            type='monotone'
            name='Danger'
            dataKey='danger'
            stroke='#b50000'
            strokeWidth={1}
            isAnimationActive={false}
            fill='url(#colorDanger)'
          />
          <Area
            type='monotone'
            name='Warning'
            dataKey='warning'
            stroke='#d0aa00'
            strokeWidth={1}
            isAnimationActive={false}
            fill='url(#colorWarning)'
          />
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='time' />
          <YAxis />
          <Tooltip labelFormatter={label => `Records: ${hour}:${label}`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
