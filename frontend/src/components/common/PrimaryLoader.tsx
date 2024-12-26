import { Box } from '@mui/material';
import { Text } from '@components/common';

interface Props {
  text?: string | null;
}

export const PrimaryLoader = ({ text = null }: Props) => {
  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box>
        <Text variant='h2'>IP Classifier</Text>
        {text ? (
          <Text variant='body1' textAlign='center' fontWeight='lg'>{text}</Text>
        ) : (
          <Box height={22} />
        )}
      </Box>
    </Box>
  );
};
