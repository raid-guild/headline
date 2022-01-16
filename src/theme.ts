const theme = {
  colors: {
    text: "#000000",
  },
  fonts: {
    fontFamily: `'Inter', 'sans-serif'`,
  },
  icons: {
    size: {
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
export type ThemeColors = keyof Theme["colors"];
export type ThemeIconSize = keyof Theme["icons"]["size"];
export type ThemeTextSize = keyof Theme["text"]["size"];
export type ThemeTextWeight = keyof Theme["text"]["weight"];
export default theme;
