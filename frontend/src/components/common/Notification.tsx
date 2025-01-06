import { Alert, alertClasses } from '@mui/material';
import { createSx, selector } from '@theme';
import { NotificationType } from '@types';

const sx = createSx({
  notification: {
    width: '100%',
    alignItems: 'center',
    color: '#fff',
    [selector.onChild(alertClasses.action)]: {
      paddingTop: 0,
      '& > button': {
        backgroundColor: 'transparent !important',
        borderRadius: '50%',
        border: 'unset',
        color: '#FFF'
      }
    }
  }
});

interface Props {
  message: string;
  type?: NotificationType;
  onClose: () => void;
}

export const Notification = ({
  message,
  onClose,
  type
}: Props) => {
  return (
    <Alert
      onClose={onClose}
      severity={type}
      variant='filled'
      sx={sx.notification}
    >
      {message}
    </Alert>
  );
};
