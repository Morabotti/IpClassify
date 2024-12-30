import { TrafficLevel } from '@enums';
import { TypographyOwnProps } from '@mui/material';

export const disableDialogBackdropClick = (
  onClose: () => void
) => (
  event: unknown,
  reason: 'backdropClick' | 'escapeKeyDown'
) => {
  if (reason === 'backdropClick') return;
  onClose();
};

export const getTextColor = (level: TrafficLevel): TypographyOwnProps['color'] => {
  switch (level) {
    case TrafficLevel.DANGER: return 'error';
    case TrafficLevel.NORMAL: return 'textPrimary';
    case TrafficLevel.WARNING: return 'warning';
    default: return 'textPrimary';
  }
};
