import { Text } from '@components/common';
import { NavigateNext, Refresh } from '@mui/icons-material';
import { Box, Breadcrumbs, Button, Skeleton, Stack } from '@mui/material';
import { createSx } from '@theme';
import { NavLink } from 'react-router';

const sx = createSx({
  link: {
    color: 'unset',
    textDecoration: 'none',
    '&:hover': {
      color: t => t.palette.text.primary
    }
  }
});

interface Props {
  ip?: string | null;
  loading?: boolean;
  disabled?: boolean;
  onReload?: () => void;
}

export const DetailsHeader = ({ ip, onReload, disabled, loading }: Props) => {
  if (loading) {
    return (
      <Box display='flex' gap={2} justifyContent='space-between' alignItems='center'>
        <Stack spacing={2}>
          <Breadcrumbs
            separator={<NavigateNext fontSize='small' />}
            aria-label='breadcrumb'
          >
            <Skeleton height={27} width={130} variant='text' />
            <Skeleton height={27} width={100} variant='text' />
          </Breadcrumbs>
        </Stack>
        <Box display='flex' gap={2}>
          <Skeleton height={40} width={100} variant='rounded' />
        </Box>
      </Box>
    );
  }

  return (
    <Box display='flex' gap={2} justifyContent='space-between' alignItems='center'>
      <Stack spacing={2} flexDirection='row'>
        <Breadcrumbs
          separator={<NavigateNext fontSize='small' />}
          aria-label='breadcrumb'
        >
          <Text variant='h5' component={NavLink} to='/catalog' sx={sx.link}>Catalog</Text>
          <Text variant='h5' color='primary'>{ip}</Text>
        </Breadcrumbs>
      </Stack>
      <Box display='flex' gap={2}>
        <Button
          variant='outlined'
          startIcon={<Refresh />}
          onClick={onReload}
          disabled={disabled}
        >
          Refresh
        </Button>
      </Box>
    </Box>
  );
};
