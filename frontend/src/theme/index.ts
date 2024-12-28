import { createTheme, ThemeVars } from '@mui/material';
import { getDarkPalette, getLightPalette } from './palette';
import { getTypography } from './typography';
import { inputCustomizations } from './custom';

export * from './utils';
export * from './palette';

declare module '@mui/material/styles' {
  interface Theme {
    vars: ThemeVars;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    highlighted: true;
  }
}

export const defaultTheme = createTheme();

export const theme = createTheme({
  cssVariables: true,
  palette: getLightPalette(),
  colorSchemes: {
    light: {
      palette: getLightPalette()
    },
    dark: {
      palette: getDarkPalette()
    }
  },
  typography: getTypography(),
  shape: { borderRadius: 8 },
  components: {
    ...inputCustomizations
  }
});
