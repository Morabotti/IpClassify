import { Chip, CircularProgress } from '@mui/material';
import { MaterialSxProps } from '@theme';
import { useWebSocket } from '@hooks';
import { WebSocketState } from '@types';

interface Props {
  sx?: MaterialSxProps;
}

const getLabel = (state: WebSocketState): React.ReactNode => {
  switch (state) {
    case 'closed': return 'OFFLINE';
    case 'error': return 'ERROR';
    case 'ready': return 'OK';
    case 'loading': return (
      <CircularProgress
        color='inherit'
        size={16}
        sx={{ color: '#fff', marginTop: 0.5 }}
      />
    );
  }
};

export const WebSocketStatusChip = ({ sx }: Props) => {
  const { state, onReconnect } = useWebSocket();

  const canReconnect = state === 'error' || state === 'closed';

  return (
    <Chip
      sx={[{ display: 'flex' }, sx] as MaterialSxProps}
      label={getLabel(state)}
      onClick={canReconnect ? onReconnect : undefined}
      color={state === 'error' ? 'error' : state === 'loading' ? 'primary' : 'success'}
      size='small'
    />
  );
};
