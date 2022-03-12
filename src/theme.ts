const theme = {
  buttons: {
    size: {
      xl: {
        padding: "1.6rem 2.4rem",
        height: "6.2rem",
      },
      lg: {
        padding: ".9rem 2.4rem",
        height: "4.8rem",
      },
      md: {
        padding: "1.1rem 1.6rem",
        height: "4.8rem",
      },
      sm: {
        padding: ".4rem 1.6rem",
        height: "2.6rem",
      },
    },
  },
  devices: {
    sm: `(min-width: '320px')`,
    md: `(min-width: '768px')`,
    lg: `(min-width: '1200px')`,
    xl: `(min-width: '2560px')`,
  },
  colors: {
    primary: "#6D9CF9",
    backgroundGrey: "#F7F7F7",
    almostWhite: "#FCFCFC",
    text: "#000000",
    helpText: "#6C6C6B",
    label: "#3A3A3A",
    grey: "#A5A5A5",
    lightGrey: "#DEDEDE",
    backgroundMediumGrey: "#F0EFEF",
    success: "#8ACA89",
    error: "#FF6771",
  },
  fonts: {
    fontFamily: `'Inter'`,
  },
  icons: {
    size: {
      xxl: "9.6rem",
      xl: "4.8rem",
      lg: "3.33rem",
      md: "2.67rem",
      sm: "2rem",
      xs: "1.33rem",
    },
  },
  text: {
    weight: {
      bold: "700",
      semibold: "600",
      normal: "400",
    },
    size: {
      lg: {
        fontSize: "2.0rem",
        lineHeight: "2.4rem",
      },
      md: {
        fontSize: "1.8rem",
        lineHeight: "2.4rem",
      },
      base: {
        fontSize: "1.6rem",
        lineHeight: "2.2rem",
      },
      sm: {
        fontSize: "1.4rem",
        lineHeight: "1.8rem",
      },
      xs: {
        fontSize: "1.2rem",
        lineHeight: "1.6rem",
      },
      xxs: {
        fontSize: "1rem",
        lineHeight: "1.4rem",
      },
    },
  },
  title: {
    xxxl: {
      fontSize: "9.6rem",
      lineHeight: "10.2rem",
      fontWeight: 900,
    },
    xxl: {
      fontSize: "7.2rem",
      lineHeight: "8.8rem",
      fontWeight: 900,
    },
    xl: {
      fontSize: "5.6rem",
      lineHeight: "6.2rem",
      fontWeight: 700,
    },
    lg: {
      fontSize: "4.8rem",
      lineHeight: "5.2rem",
      fontWeight: 700,
    },
    md: {
      fontSize: "3.2rem",
      lineHeight: "3.8rem",
      fontWeight: 600,
    },
    sm: {
      fontSize: "2.4rem",
      lineHeight: "2.8rem",
      fontWeight: 600,
    },
  },
};

export type Theme = typeof theme;
export type ThemeButtonSize = keyof Theme["buttons"]["size"];
export type ThemeColors = keyof Theme["colors"];
export type ThemeDevices = keyof Theme["devices"];
export type ThemeIconSize = keyof Theme["icons"]["size"];
export type ThemeTextSize = keyof Theme["text"]["size"];
export type ThemeTextWeight = keyof Theme["text"]["weight"];
export type ThemeTitleSize = keyof Theme["title"];
export default theme;
