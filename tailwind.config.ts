import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      fontSize: {
        'xxs': '0.625rem', // 10px when base is 16px
        '2xs': '0.625rem', // 10px when base is 16px
        '3xs': '0.5rem', // 8px when base is 16px
      },
    },
  },
  plugins: [],
} satisfies Config;
