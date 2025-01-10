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

export const isValidIp = (str: string): boolean => {
  const octet = '(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?|0)';
  const regex = new RegExp(`^${octet}\\.${octet}\\.${octet}\\.${octet}$`);
  return regex.test(str);
};
