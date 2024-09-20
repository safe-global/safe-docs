import { ThemeProvider, useMediaQuery, type Theme } from '@mui/material'
import type { Shadows } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import type { TypographyOptions } from '@mui/material/styles/createTypography'
import { type FC } from 'react'

// This component is necessary to make the theme available in the library components
// Is not enough wrapping the client app with the regular ThemeProvider as the library components
// are not aware of the theme context:
// https://github.com/mui/material-ui/issues/32806
// https://stackoverflow.com/questions/69072004/material-ui-theme-not-working-in-shared-component
type SafeThemeProviderProps = {
  children: (safeTheme: Theme) => JSX.Element
}

const SafeThemeProvider: FC<SafeThemeProviderProps> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = createSafeTheme(prefersDarkMode)

  return <ThemeProvider theme={theme}>{children(theme)}</ThemeProvider>
}

export default SafeThemeProvider

const createSafeTheme = (prefersDarkMode: boolean): Theme => {
  const colors = prefersDarkMode ? darkPalette : lightPalette
  const shadowColor = colors.primary.light

  return createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      ...colors
    },
    shape: {
      borderRadius: 6
    },
    shadows: [
      'none',
      prefersDarkMode
        ? `0 0 2px ${shadowColor}`
        : `0 1px 4px ${shadowColor}0a, 0 4px 10px ${shadowColor}14`,
      prefersDarkMode
        ? `0 0 2px ${shadowColor}`
        : `0 1px 4px ${shadowColor}0a, 0 4px 10px ${shadowColor}14`,
      prefersDarkMode
        ? `0 0 2px ${shadowColor}`
        : `0 2px 20px ${shadowColor}0a, 0 8px 32px ${shadowColor}14`,
      prefersDarkMode
        ? `0 0 2px ${shadowColor}`
        : `0 8px 32px ${shadowColor}0a, 0 24px 60px ${shadowColor}14`,
      ...Array(20).fill('none')
    ] as Shadows,
    typography,
    components: {
      MuiButton: {
        styleOverrides: {
          sizeMedium: {
            fontSize: '16px',
            padding: '12px 24px'
          },
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            fontWeight: 'bold',
            lineHeight: 1.25,
            borderColor: theme.palette.primary.main,
            textTransform: 'none',
            '&:hover': {
              boxShadow: 'none'
            }
          }),
          outlined: {
            border: '2px solid',
            '&:hover': {
              border: '2px solid'
            }
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: prefersDarkMode ? 'background.default' : '#eeeeee'
          }
        }
      }
    }
  })
}

const safeFontFamily = 'DM Sans, sans-serif'

const typography: TypographyOptions = {
  fontFamily: safeFontFamily,
  h1: {
    fontSize: '32px',
    lineHeight: '36px',
    fontWeight: 700
  },
  h4: {
    fontSize: '20px',
    lineHeight: '26px'
  }
}

const darkPalette = {
  text: {
    primary: '#FFFFFF',
    secondary: '#636669',
    disabled: '#636669'
  },
  primary: {
    dark: '#0cb259',
    main: '#12FF80',
    light: '#A1A3A7'
  }
}

const lightPalette = {
  text: {
    primary: '#000000',
    secondary: '#636669',
    disabled: '#636669'
  },
  primary: {
    dark: '#0cb259',
    main: '#12FF80',
    light: '#A1A3A7'
  }
}
