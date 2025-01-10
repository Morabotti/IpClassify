import { Text } from '@components/common';
import { Box, Skeleton } from '@mui/material';
import { createSx } from '@theme';

const sx = createSx({
  content: {
    display: 'flex',
    width: '100%',
    borderBottom: t => `1px solid ${t.palette.grey[200]}`,
    '& > div:not(:last-child)': {
      borderRight: t => `1px solid ${t.palette.grey[200]}`
    }
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    px: 2,
    py: 1.5,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    '& svg': {
      width: 28,
      height: 28,
      mb: 1
    }
  }
});

interface Item {
  icon?: React.ReactNode;
  title: string;
  value: string | number;
}

interface Props {
  items: Item[];
  loading?: boolean;
}

export const DetailsGroupValues = ({ items, loading }: Props) => {
  if (loading) {
    return (
      <Box sx={sx.content}>
        {items.map(i => (
          <Box key={i.title} sx={sx.item}>
            {!!i.icon && <Skeleton variant='circular' width={28} height={28} />}
            <Skeleton width='40%' height={21} variant='text' />
            <Skeleton width='50%' height={21} variant='text' />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={sx.content}>
      {items.map(i => (
        <Box key={i.title} sx={sx.item}>
          {!!i.icon && i.icon}
          <Text variant='body1' fontSize='1rem'>
            {i.value}
          </Text>
          <Text variant='body2' color='textSecondary'>
            {i.title}
          </Text>
        </Box>
      ))}
    </Box>
  );
};
