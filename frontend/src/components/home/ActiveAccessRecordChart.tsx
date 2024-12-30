import { trafficSummaryAtom } from '@atoms';
import { Box, Checkbox, FormControlLabel, Skeleton, Switch } from '@mui/material';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { CartesianGrid, XAxis, YAxis, ResponsiveContainer, AreaChart, Tooltip, Area } from 'recharts';

export const ActiveAccessRecordChart = () => {
  const [stacked, setStacked] = useState(false);
  const trafficSummary = useAtomValue(trafficSummaryAtom);

  if (trafficSummary === null) {
    return (
      <Box p={1} height='100%'>
        <Skeleton width='100%' variant='rectangular' height='100%' />
      </Box>
    );
  }

  return (
    <Box width='100%' height='100%' position='relative'>
      <Box position='absolute' top={24} right={24} zIndex={5}>
        <FormControlLabel
          control={<Switch checked={stacked} />}
          label='Stacked'
          onChange={(e, checked) => setStacked(checked)}
        />
      </Box>
      <ResponsiveContainer height={300} width='100%'>
        <AreaChart
          data={trafficSummary}
          margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
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
            stackId={stacked ? '1' : undefined}
          />
          <Area
            type='monotone'
            name='Danger'
            dataKey='danger'
            stroke='#b50000'
            strokeWidth={1}
            isAnimationActive={false}
            fill='url(#colorDanger)'
            stackId={stacked ? '1' : undefined}
          />
          <Area
            type='monotone'
            name='Warning'
            dataKey='warning'
            stroke='#d0aa00'
            strokeWidth={1}
            isAnimationActive={false}
            fill='url(#colorWarning)'
            stackId={stacked ? '1' : undefined}
          />
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='timestamp' />
          <YAxis allowDecimals={false} />
          <Tooltip
            wrapperStyle={{ zIndex: 10 }}
            labelFormatter={(_label, [first]) => {
              const time = first?.payload?.time ?? null;
              if (!time) return `Records: --:--:--`;
              return `Records: ${dayjs.unix(time).format('HH:mm:ss')}`;
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};
