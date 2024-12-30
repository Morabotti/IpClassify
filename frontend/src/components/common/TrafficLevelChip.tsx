import { TrafficLevel } from '@enums';
import { Chip, ChipOwnProps } from '@mui/material';

const getLabel = (level: TrafficLevel | null, isShort?: boolean): React.ReactNode => {
  switch (level) {
    case TrafficLevel.DANGER: return isShort ? 'E' : 'ERROR';
    case TrafficLevel.WARNING: return isShort ? 'W' : 'WARNING';
    case TrafficLevel.NORMAL: return isShort ? 'N' : 'NORMAL';
    default: return 'ALL';
  }
};

const getColor = (level: TrafficLevel | null): ChipOwnProps['color'] => {
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
  short?: boolean;
}

export const TrafficLevelChip = ({ level, size, short }: Props) => {
  return (
    <Chip
      label={getLabel(level, short)}
      color={getColor(level)}
      size={size}
    />
  );
};
