export const disableDialogBackdropClick = (
  onClose: () => void
) => (
  event: unknown,
  reason: 'backdropClick' | 'escapeKeyDown'
) => {
  if (reason === 'backdropClick') return;
  onClose();
};
