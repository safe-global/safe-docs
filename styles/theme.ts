import { createTheme } from '@mui/material/styles'
import type { Shadows } from '@mui/material/styles'

import { palette } from './palette'

declare module '@mui/material/styles' {
  // Custom color palettes
  interface Palette {
    border: Palette['primary']
    logo: Palette['primary']
    backdrop: Palette['primary']
    static: Palette['primary']
  }
  interface PaletteOptions {
    border: PaletteOptions['primary']
    logo: PaletteOptions['primary']
    backdrop: PaletteOptions['primary']
    static: PaletteOptions['primary']
  }

  interface TypeBackground {
    main: string
    light: string
  }

  // Custom color properties
  interface PaletteColor {
    background?: string
  }
  interface SimplePaletteColorOptions {
    background?: string
  }
}

// declare module '@mui/material/Button' {
//   interface ButtonPropsColorOverrides {
//     background: true
//   }
// }

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1630
    }
  },
  palette: {
    mode: 'dark',
    ...palette
  },
  spacing: 8,
  shape: {
    borderRadius: 6
  },
  shadows: [
    'none',
    `0 0 2px ${palette.primary.light}`,
    ...Array(23).fill('none')
  ] as Shadows,
  typography: {
    fontFamily: 'DM Sans, sans-serif',
    h1: {
      fontSize: '56px',
      lineHeight: '60px',
      fontWeight: 700,
      paddingTop: '16px',
      '@media (min-width:600px)': {
        fontSize: '36px',
        lineHeight: '48px'
      }
    },
    h2: {
      fontSize: '40px',
      lineHeight: '44px',
      fontWeight: 700,

      '@media (min-width:600px)': {
        marginTop: '32px',
        fontSize: '30px',
        lineHeight: '44px'
      }
    },
    h3: {
      fontSize: '24px',
      lineHeight: '30px',
      fontWeight: 700,
      marginTop: '16px',
      paddingBottom: '8px'
    },
    h4: {
      fontSize: '20px',
      lineHeight: '30px',
      fontWeight: 700,

      '@media (min-width:600px)': {
        fontSize: '20px',
        lineHeight: '32px'
      }
    },
    h5: {
      fontSize: '16px'
    },
    body1: {
      fontSize: '16px',
      lineHeight: '24px',

      '@media (min-width:600px)': {
        fontSize: '18px',
        lineHeight: '28px'
      }
    },
    body2: {
      fontSize: '14px',
      lineHeight: '24px'
    },
    caption: {
      fontSize: '12px',
      lineHeight: '24px',
      letterSpacing: '0.1em',
      fontWeight: 500,
      textTransform: 'uppercase',
      color: palette.primary.light
    },
    overline: {
      fontSize: '11px',
      lineHeight: '14px',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    }
  },
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        fontSizeSmall: {
          width: '1rem',
          height: '1rem'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        sizeLarge: {
          fontSize: '18px',
          lineHeight: '26px',
          padding: '15px 22px'
        },
        root: {
          textTransform: 'inherit'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: 'inherit'
        },
        root: {
          color: palette.border.main
        }
      }
    },
    MuiContainer: {
      defaultProps: {
        fixed: true,
        maxWidth: 'xl',
        disableGutters: true
      },
      styleOverrides: {
        root: {
          paddingLeft: '15px',
          paddingRight: '15px',

          '@media (min-width:1630px)': {
            paddingLeft: '24px',
            paddingRight: '24px'
          }
        }
      }
    }
  }
})
