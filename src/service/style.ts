export const getThemeColors = (darkMode: boolean) => ({
  primary: "#EF9B28", // ثابت
  text: darkMode ? "#f1f1f1" : "#212529",
  mutedText: darkMode ? "#bdbdbd" : "#6e6e6e",
  icon: darkMode ? "#ffb347" : "#2c2c2c",
  cardBg: darkMode ? "rgba(24, 26, 27, 0.65)" : "rgba(255, 255, 255, 0.85)",

  statCard: {
    blue: darkMode
      ? "linear-gradient(135deg, rgba(0, 172, 255, 0.3), rgba(0, 102, 204, 0.25))"
      : "linear-gradient(135deg, rgba(0, 123, 255, 0.6), rgba(173, 216, 230, 0.5))",

    green: darkMode
      ? "linear-gradient(135deg, rgba(50, 205, 50, 0.3), rgba(0, 100, 0, 0.25))"
      : "linear-gradient(135deg, rgba(40, 167, 69, 0.6), rgba(144, 238, 144, 0.5))",

    orange: darkMode
      ? "linear-gradient(135deg, rgba(255, 165, 0, 0.3), rgba(255, 87, 34, 0.25))"
      : "linear-gradient(135deg, rgba(255, 193, 7, 0.5), rgba(255, 224, 178, 0.4))",

    red: darkMode
      ? "linear-gradient(135deg, rgba(220, 20, 60, 0.3), rgba(139, 0, 0, 0.25))"
      : "linear-gradient(135deg, rgba(255, 99, 132, 0.5), rgba(255, 205, 210, 0.4))",

    violet: darkMode
      ? "linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(72, 28, 128, 0.25))"
      : "linear-gradient(135deg, rgba(186, 104, 200, 0.5), rgba(225, 190, 231, 0.4))",

    teal: darkMode
      ? "linear-gradient(135deg, rgba(0, 150, 136, 0.3), rgba(0, 77, 64, 0.25))"
      : "linear-gradient(135deg, rgba(0, 150, 136, 0.5), rgba(178, 223, 219, 0.4))",
  },
});
