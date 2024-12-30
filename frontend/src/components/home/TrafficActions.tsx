import { useState } from 'react';
import { loadingAtom } from '@atoms';
import { trafficApi } from '@client';
import { Text } from '@components/common';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Stack, TextField } from '@mui/material';
import { MockTrafficRequestState } from '@types';
import { useAtom } from 'jotai';

const actions = [
  [1, 5, 11, 18],
  [20, 30, 38, 44],
  [110, 225, 350, 500],
  [750, 1000, 2000, 5000],
  [7500, 10000, 25000]
];

export const TrafficActions = () => {
  const [loading, setLoading] = useAtom(loadingAtom);
  const [request, setRequest] = useState<MockTrafficRequestState>({
    from: null,
    onlyKnown: true,
    customAmount: 1
  });

  const onSend = async (amount: number) => {
    setLoading(true);
    try {
      await trafficApi.create({
        amount,
        from: request.from,
        onlyKnown: request.onlyKnown
      });
    }
    catch (e) {
      console.error('error');
    }
    setLoading(false);
  };

  return (
    <Box>
      <Box p={1}>
        <Text variant='h4' component='h2' color='info' align='center'>
          Traffic Options
        </Text>
      </Box>
      <Stack gap={2}>
        <Box py={1} px={2}>
          <FormControlLabel
            control={<Checkbox checked={request.onlyKnown} />}
            label='Only requests from known sources'
            disabled={loading}
            onChange={(e, onlyKnown) => setRequest(prev => ({ ...prev, onlyKnown }))}
          />
          <FormControlLabel
            control={<Checkbox checked={request.from !== null} />}
            label='Send from specific address(es)'
            disabled={loading}
            onChange={(e, checked) => setRequest(prev => ({ ...prev, from: checked ? '' : null }))}
          />
          <Box mt={1}>
            <FormControl fullWidth disabled={request.from === null || loading}>
              <FormLabel>Spefic IP addresses</FormLabel>
              <TextField
                fullWidth
                disabled={request.from === null || loading}
                onChange={(e) => setRequest(prev => ({ ...prev, from: e.target.value }))}
              />
            </FormControl>
          </Box>
        </Box>
        <Text variant='h4' component='h2' color='info' align='center'>
          Traffic Actions
        </Text>
        {actions.map((actionGroup, index) => (
          <Stack key={`group-${index}`} px={2} gap={1} direction='row' overflow='hidden'>
            {actionGroup.map(button => (
              <Button
                key={button}
                variant='contained'
                fullWidth
                disableElevation
                color='info'
                disabled={!request.onlyKnown && button >= 45}
                onClick={() => onSend(button)}
              >
                {`+${button}`}
              </Button>
            ))}
          </Stack>
        ))}
        <Stack px={2} gap={1} direction='row' alignItems='flex-end'>
          <FormControl fullWidth disabled={loading}>
            <FormLabel>Custom amount</FormLabel>
            <TextField
              fullWidth
              type='number'
              disabled={loading}
              value={request.customAmount}
              onChange={(e) => setRequest(prev => ({ ...prev, customAmount: Number(e.target.value) }))}
            />
          </FormControl>
          <Button variant='contained' disableElevation color='info' onClick={() => onSend(request.customAmount)}>
            Send
          </Button>
        </Stack>
        <Box px={2}>
          <Text variant='body2' color='textSecondary'>
            API for getting IPs only allow 45 requests/min
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};
