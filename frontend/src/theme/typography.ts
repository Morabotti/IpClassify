import { defaultTheme } from '@theme';

export const getTypography = () => {
  return {
    h1: {
      fontSize: defaultTheme.typography.pxToRem(48),
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: -0.5
    },
    h2: {
      fontSize: defaultTheme.typography.pxToRem(36),
      fontWeight: 600,
      lineHeight: 1.2
    },
    h3: {
      fontSize: defaultTheme.typography.pxToRem(30),
      lineHeight: 1.2
    },
    h4: {
      fontSize: defaultTheme.typography.pxToRem(24),
      fontWeight: 600,
      lineHeight: 1.5
    },
    h5: {
      fontSize: defaultTheme.typography.pxToRem(20),
      fontWeight: 600
    },
    h6: {
      fontSize: defaultTheme.typography.pxToRem(18),
      fontWeight: 600
    },
    subtitle1: {
      fontSize: defaultTheme.typography.pxToRem(18)
    },
    subtitle2: {
      fontSize: defaultTheme.typography.pxToRem(14),
      fontWeight: 500
    },
    body1: {
      fontSize: defaultTheme.typography.pxToRem(14)
    },
    body2: {
      fontSize: defaultTheme.typography.pxToRem(14),
      fontWeight: 400
    },
    caption: {
      fontSize: defaultTheme.typography.pxToRem(12),
      fontWeight: 400
    }
  };
};
