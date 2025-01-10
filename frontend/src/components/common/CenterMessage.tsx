import { Text } from '@components/common';
import { SvgIconComponent } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { MaterialSxProps } from '@theme';

interface Props {
  icon: SvgIconComponent;
  title?: string;
  text: string;
  buttonText?: string;
  manualHeight?: string | number;
  sx?: MaterialSxProps;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

export const CenterMessage: React.FC<Props> = ({
  icon: Icon,
  title,
  text,
  manualHeight,
  buttonText,
  sx,
  onClick,
  onMouseEnter
}: Props) => {
  return (
    <Box
      sx={[{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: manualHeight ?? '100%'
      }, sx] as MaterialSxProps}
    >
      <Box
        sx={{
          maxWidth: '380px',
          width: '100%',
          p: 1,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Icon sx={{ width: 86, height: 86, color: 'text.secondary' }} />
        {title && (
          <Text variant='h5' sx={{ my: 2, marginBlockEnd: 0 }}>
            {title}
          </Text>
        )}
        <Text variant='body1' sx={{ my: 2, color: 'text.secondary' }}>
          {text}
        </Text>
        {onClick && (
          <Button
            variant='contained'
            color='secondary'
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            disableElevation
          >
            {buttonText}
          </Button>
        )}
      </Box>
    </Box>
  );
};
