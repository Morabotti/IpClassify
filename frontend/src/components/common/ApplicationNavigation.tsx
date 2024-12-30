import { AppBar, LinearProgress, Box, Tooltip } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Text, WebSocketStatusChip } from '@components/common';
import { MaterialSxProps, createSx } from '@theme';
import { ArrowDropDown, SvgIconComponent, Troubleshoot } from '@mui/icons-material';
import { useAtomValue } from 'jotai';
import { loadingAtom } from '@atoms';

const APP_BAR_HEIGHT = '48px;';

const sx = createSx({
  container: {
    display: 'flex',
    flexGrow: 1,
    mt: APP_BAR_HEIGHT,
    height: `calc(100% - ${APP_BAR_HEIGHT})`,
    backgroundColor: theme => theme.vars.palette.background.default
  },
  base: {
    height: '100%',
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    position: 'relative'
  },
  appBar: theme => ({
    postion: 'fixed',
    height: APP_BAR_HEIGHT,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'visible',
    backgroundColor: theme.vars.palette.background.paper,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: theme.vars.palette.divider,
    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 10px 0px',
    zIndex: theme.vars.zIndex.appBar
  }),
  applicationNav: {
    flexGrow: 1,
    height: '100%',
    alignItems: 'center'
  },
  applicationName: {
    alignItems: 'center',
    py: 1,
    pl: 1,
    pr: 3,
    height: '100%',
    textDecoration: 'none'
  },
  linkWrapper: theme => ({
    height: '100%',
    position: 'relative',
    '& > a, & > button': {
      textDecoration: 'none !important',
      borderRadius: 0,
      display: 'inline-flex',
      height: '100%',
      alignItems: 'center',
      '&:hover > p': {
        color: theme.vars.palette.text.primary
      },
      '& > p': {
        px: 1.5,
        color: theme.vars.palette.text.secondary
      }
    }
  }),
  unstyledButton: {
    appearance: 'none',
    cursor: 'pointer',
    outline: 'unset',
    padding: 'unset',
    border: 'unset',
    backgroundColor: 'unset',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  applicationNavRight: {
    height: '100%',
    alignItems: 'center'
  },
  currentUser: {
    positino: 'relative',
    overflow: 'visible',
    '& > button': {
      display: 'flex',
      px: 2
    }
  },
  main: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'padding-left 100ms ease-in',
    overflow: 'hidden'
  },
  content: {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  },
  linkActive: theme => ({
    '& > a > p': {
      color: theme.vars.palette.primary.main,
      '&:hover': {
        color: theme.vars.palette.primary.dark
      }
    }
  })
});

interface ButtonProps {
  to?: string;
  onClick?: () => void;
  active?: boolean;
  tooltipTitle?: string;
  children?: React.ReactNode;
  icon?: SvgIconComponent;
  sx?: MaterialSxProps;
  ref?: React.Ref<unknown>;
}

export const NavigationButton = ({
  onClick,
  to,
  active,
  children,
  tooltipTitle,
  sx: internalSx = {},
  icon: Icon,
  ref
}: ButtonProps) => {
  return (
    <Tooltip
      title={tooltipTitle}
      placement='bottom'
      disableFocusListener={!tooltipTitle}
      disableHoverListener={!tooltipTitle}
      disableInteractive={!tooltipTitle}
      disableTouchListener={!tooltipTitle}
    >
      <Box
        ref={ref}
        display='flex'
        width={Icon ? 48 : undefined}
        sx={[
          sx.linkWrapper,
          internalSx,
          (active && sx.linkActive)
        ] as MaterialSxProps}
      >
        <Box
          sx={sx.unstyledButton}
          onClick={onClick}
          component={onClick ? 'button' : Link}
          to={to as string}
        >
          {children}
          {Icon && (
            <Icon
              color='inherit'
              sx={theme => ({ fontSize: theme.typography.h5.fontSize, mt: '1px' })}
            />
          )}
        </Box>
      </Box>
    </Tooltip>
  );
};

interface Props {
  children?: React.ReactNode;
}

export const ApplicationNavigation = ({ children }: Props) => {
  const { pathname } = useLocation();
  const loading = useAtomValue(loadingAtom);

  return (
    <Box sx={sx.container} className='application-root'>
      <Box sx={sx.base}>
        <AppBar sx={sx.appBar}>
          <Box display='flex' width='100%' height='100%' sx={{ userSelect: 'none' }}>
            <Box display='flex' sx={sx.applicationNav}>
              <Box display='flex' sx={sx.applicationName} component={Link} to='/'>
                <Troubleshoot color='primary' sx={{ width: 26, height: 26, marginBottom: '4px' }} />
                <Text
                  ml={0.5}
                  color='text.primary'
                  fontWeight='500'
                >
                  IPClassify
                </Text>
              </Box>
              <NavigationButton to='/' active={pathname === '/'}>
                <Text fontWeight={500} variant='body2' textTransform='uppercase'>Home</Text>
              </NavigationButton>
              <NavigationButton to='/catalog' active={pathname.includes('/catalog')}>
                <Text fontWeight={500} variant='body2' textTransform='uppercase'>Catalog</Text>
              </NavigationButton>
            </Box>
            <Box display='flex' justifyContent='flex-end' sx={sx.applicationNavRight}>
              <WebSocketStatusChip />
              <NavigationButton sx={sx.currentUser} onClick={() => {}}>
                <Box textAlign='left' mr={0.5}>
                  <Text variant='body2' color='text.primary' lineHeight={1} fontWeight={500}>Test Tester</Text>
                </Box>
                <Box>
                  <ArrowDropDown color='action' />
                </Box>
              </NavigationButton>
            </Box>
          </Box>
        </AppBar>
        <Box component='main' height='100%' width='100%' flex={1} position='relative' sx={sx.main}>
          <Box sx={sx.content}>
            <Outlet />
            {children}
            {loading && (
              <LinearProgress
                sx={theme => ({
                  position: 'fixed',
                  top: APP_BAR_HEIGHT,
                  left: 0,
                  width: '100%',
                  height: 3,
                  zIndex: `calc(${theme.zIndex.appBar} + 10)`
                })}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
