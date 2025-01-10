import { Paper, Skeleton } from '@mui/material';
import { createSx } from '@theme';

const sx = createSx({
  content: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    '& > iframe': {
      width: '100%',
      height: '100%',
      border: 'none'
    }
  }
});

interface Props {
  lat?: number | null;
  lng?: number | null;
  zoom?: number;
  loading?: boolean;
}

export const MapsContainer = ({ lat = null, lng = null, loading = false, zoom = 8 }: Props) => {
  if (loading) {
    return (
      <Paper variant='outlined'>
        <Skeleton width='100%' height='100%' variant='rounded' />
      </Paper>
    );
  }

  return (
    <Paper variant='outlined' sx={sx.content}>
      <iframe src={`http://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`} />
    </Paper>
  );
};
