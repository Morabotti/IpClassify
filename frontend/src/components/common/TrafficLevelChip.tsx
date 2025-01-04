import { TrafficLevel } from '@enums';
import { Chip, chipClasses, ChipOwnProps } from '@mui/material';
import { createSx, green, MaterialSxProps, orange, red, selector } from '@theme';

const _sx = createSx({
  chip: t => ({
    [selector.on(chipClasses.colorError)]: {
      bgcolor: red[300],
      color: t.palette.text.primary
    },
    [selector.on(chipClasses.colorWarning)]: {
      bgcolor: orange[300],
      color: t.palette.text.primary
    },
    [selector.on(chipClasses.colorSuccess)]: {
      bgcolor: green[300],
      color: t.palette.text.primary
    }
  })
});

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
  sx?: MaterialSxProps;
}

export const TrafficLevelChip = ({ level, size, short, sx }: Props) => {
  return (
    <Chip
      label={getLabel(level, short)}
      color={getColor(level)}
      size={size}
      sx={[_sx.chip, sx] as MaterialSxProps}
    />
  );
};
