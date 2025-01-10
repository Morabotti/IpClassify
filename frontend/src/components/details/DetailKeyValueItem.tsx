import { Text } from '@components/common';
import { SvgIconComponent } from '@mui/icons-material';
import { Box, Skeleton } from '@mui/material';
import { createSx } from '@theme';

const sx = createSx({
  content: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
    px: 2,
    py: 1,
    borderBottom: t => `1px solid ${t.palette.grey[200]}`
  },
  text: {
    flexDirection: 'column',
    gap: 1
  },
  icon: {
    width: 28,
    height: 28,
    color: t => t.palette.grey[500]
  }
});

interface Props {
  icon?: SvgIconComponent;
  title?: string;
  value?: string | number;
  loading?: boolean;
}

export const DetailKeyValueItem = ({ icon: Icon, title, value, loading }: Props) => {
  if (loading) {
    return (
      <Box sx={sx.content}>
        {Icon && (
          <Skeleton variant='circular' width={30} height={30} />
        )}
        <Box sx={sx.text}>
          <Skeleton width='60%' height={21} variant='text' />
          <Skeleton width='50%' height={21} variant='text' />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={sx.content}>
      {!!Icon && <Icon sx={sx.icon} />}
      <Box sx={sx.text}>
        <Text variant='body1' fontSize='1rem'>
          {value}
        </Text>
        <Text variant='body2' color='textSecondary'>
          {title}
        </Text>
      </Box>
    </Box>
  );
};
