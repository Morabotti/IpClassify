import { useId } from 'react';
import { Close } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText, LinearProgress, IconButton } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  actionConfirmText?: string;
  actionCancelText?: string;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  description,
  title,
  actionConfirmText,
  actionCancelText,
  disabled = false,
  loading = false,
  children
}: Props) => {
  const id = useId();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      aria-labelledby={`${id}-confirm-dialog-title`}
      aria-describedby={`${id}-confirm-dialog-description`}
    >
      {loading && <LinearProgress sx={{ position: 'absolute', top: 0, width: '100%' }} />}
      <DialogTitle id={`${id}-confirm-dialog-title`} sx={{ color: 'info.main' }}>
        {title}
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: t => t.spacing(1.5),
            top: t => t.spacing(1.5)
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {children || (
          <DialogContentText id={`${id}-confirm-dialog-description`} variant='body1'>
            {description}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions sx={{ pt: 1, pb: 2, px: 3 }}>
        <Button
          onClick={onClose}
          color='inherit'
          disableElevation
          variant='contained'
          sx={{ color: 'common.black' }}
        >
          {actionCancelText ?? 'Close'}
        </Button>
        <Button
          onClick={onConfirm}
          color='primary'
          autoFocus
          disableElevation
          variant='contained'
          disabled={disabled}
        >
          {actionConfirmText ?? 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
