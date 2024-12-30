import { Chip, ChipOwnProps, CircularProgress, colors, Tooltip } from '@mui/material';
import { MaterialSxProps } from '@theme';
import { useWebSocket } from '@hooks';
import { WebSocketState } from '@types';
import { Podcasts, PriorityHigh, WifiOff } from '@mui/icons-material';

interface Props {
  sx?: MaterialSxProps;
}

const getTitle = (state: WebSocketState): React.ReactNode => {
  switch (state) {
    case 'closed': return 'Offline';
    case 'error': return 'Error occured';
    case 'ready': return 'Connected';
    case 'loading': return 'Loading...';
  }
};

const getContent = (state: WebSocketState): React.ReactNode => {
  switch (state) {
    case 'closed': return (
      <WifiOff color='inherit' sx={{ fontSize: 20, marginTop: 0.75, color: '#fff' }} />
    );
    case 'error': return (
      <PriorityHigh color='inherit' sx={{ fontSize: 18, marginTop: 0.75, color: colors.red[50] }} />
    );
    case 'ready': return (
      <Podcasts color='inherit' sx={{ fontSize: 22, marginTop: 0.75, color: colors.green[50] }} />
    );
    case 'loading': return (
      <CircularProgress
        color='inherit'
        size={16}
        sx={{ color: '#fff', marginTop: 0.5 }}
      />
    );
  }
};

const getColor = (state: WebSocketState): ChipOwnProps['color'] => {
  switch (state) {
    case 'closed': return 'warning';
    case 'error': return 'error';
    case 'ready': return 'success';
    case 'loading': return 'primary';
  }
};

export const WebSocketStatusChip = ({ sx }: Props) => {
  const { state, onReconnect } = useWebSocket();
  const canReconnect = state === 'error' || state === 'closed';

  return (
    <Tooltip title={getTitle(state)}>
      <Chip
        sx={[{ display: 'flex' }, sx] as MaterialSxProps}
        label={getContent(state)}
        onClick={canReconnect ? onReconnect : undefined}
        color={getColor(state)}
        size='small'
      />
    </Tooltip>
  );
};
