import { createTheme, Theme } from "@material-ui/core/styles";
import { ThemePreference } from "./reducers/settingsReducer";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export function useTheme(themePreference: ThemePreference): Theme {
  let prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  if (themePreference === ThemePreference.Always) {
    prefersDarkMode = true;
  } else if (themePreference === ThemePreference.Never) {
    prefersDarkMode = false;
  }

  if (prefersDarkMode) {
    return createTheme({
      palette: {
        primary: {
          main: "#4379FF",
        },
        secondary: {
          main: "#97FBD1",
        },
        background: {
          default: "#f5f7f9",
        },
        type: "dark",
      },
    });
  }

  return createTheme({
    palette: {
      primary: {
        main: "#1d4ed8",
      },
      secondary: {
        main: "#0891b2",
      },
      background: {
        default: "#ffffff",
        paper: "#ffffff",
      },
      text: {
        primary: "#0b1220",
        secondary: "#475569",
      },
      divider: "rgba(15,23,42,0.12)",
      type: "light",
    },
    typography: {
      fontFamily: "'Manrope', 'Roboto', 'Helvetica', 'Arial', sans-serif",
      h6: {
        fontWeight: 650,
      },
      subtitle1: {
        fontWeight: 650,
      },
      button: {
        fontWeight: 600,
        textTransform: "none",
      },
    },
    shape: {
      borderRadius: 12,
    },
    overrides: {
      MuiPaper: {
        rounded: {
          borderRadius: 16,
        },
        outlined: {
          border: "1px solid rgba(15,23,42,0.10)",
          boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
        },
      },
      MuiButton: {
        root: {
          borderRadius: 999,
          textTransform: "none",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
          boxShadow: "0 2px 8px rgba(29,78,216,0.25)",
          "&:hover": {
            background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
          },
        },
        outlined: {
          borderColor: "#1d4ed8",
        },
      },
      MuiChip: {
        root: {
          borderRadius: 999,
        },
        outlined: {
          borderColor: "rgba(15,23,42,0.15)",
        },
        colorPrimary: {
          backgroundColor: "#dbeafe",
          color: "#1d4ed8",
        },
      },
      MuiTableCell: {
        head: {
          textTransform: "uppercase",
          fontSize: "0.72rem",
          fontWeight: 600,
          letterSpacing: "0.05em",
          padding: "12px 16px",
        },
      },
      MuiTableRow: {
        root: {
          "&:hover": {
            backgroundColor: "#f3f6ff",
          },
        },
      },
      MuiListItem: {
        root: {
          borderRadius: 14,
          "&:hover": {
            backgroundColor: "#dbeafe",
          },
        },
      },
      MuiDrawer: {
        paperAnchorDockedLeft: {
          borderRight: "1px solid rgba(15,23,42,0.10)",
          boxShadow: "2px 0 8px rgba(15,23,42,0.04)",
        },
      },
      MuiOutlinedInput: {
        root: {
          borderRadius: 12,
        },
      },
      MuiIconButton: {
        root: {
          "&:hover": {
            backgroundColor: "#eff6ff",
          },
        },
      },
    },
  });
}

export function isDarkTheme(theme: Theme): boolean {
  return theme.palette.type === "dark";
}
