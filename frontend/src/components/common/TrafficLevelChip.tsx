import { TrafficLevel } from '@enums';
import { Chip } from '@mui/material';

const getLabel = (level: TrafficLevel | null): React.ReactNode => {
  switch (level) {
    case TrafficLevel.DANGER: return 'ERROR';
    case TrafficLevel.WARNING: return 'WARNING';
    case TrafficLevel.NORMAL: return 'NORMAL';
    default: return 'ALL';
  }
};

const getColor = (
  level: TrafficLevel | null
): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (level) {
    case TrafficLevel.DANGER: return 'error';
    case TrafficLevel.WARNING: return 'warning';
    case TrafficLevel.NORMAL: return 'success';
    default: return 'primary';
  }
};

interface Props {
  level: TrafficLevel | null;
  size?: 'small' | 'medium';
}

export const TrafficLevelChip = ({ level, size }: Props) => {
  return (
    <Chip
      label={getLabel(level)}
      color={getColor(level)}
      size={size}
    />
  );
};
