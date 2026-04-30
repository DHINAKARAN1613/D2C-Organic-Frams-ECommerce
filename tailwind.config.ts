import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Semantic Theme Tokens
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",

                surface: {
                    DEFAULT: "hsl(var(--surface))",
                    highlight: "hsl(var(--surface-highlight))",
                },

                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },

                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                    text: "hsl(var(--muted-foreground))", // Mapping legacy use
                },

                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },

                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },

                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },

                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--primary))", // Ring matches primary

                // Legacy Compatibility (to be phased out or mapped)
                "background-light": "#f6f8f7",
                "background-dark": "hsl(var(--background))",
                "surface-dark": "hsl(var(--surface))",
                "secondary-text": "hsl(var(--muted-foreground))",
            },
            fontFamily: {
                display: ["var(--font-spline)", "sans-serif"],
                sans: ["var(--font-spline)", "sans-serif"],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                "xl": "2rem",
                "2xl": "3rem",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
