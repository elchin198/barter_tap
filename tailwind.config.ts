import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "let(--radius)",
        md: "calc(let(--radius) - 2px)",
        sm: "calc(let(--radius) - 4px)",
      },
      colors: {
        background: "hsl(let(--background))",
        foreground: "hsl(let(--foreground))",
        card: {
          DEFAULT: "hsl(let(--card))",
          foreground: "hsl(let(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(let(--popover))",
          foreground: "hsl(let(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(let(--primary))",
          foreground: "hsl(let(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(let(--secondary))",
          foreground: "hsl(let(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(let(--muted))",
          foreground: "hsl(let(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(let(--accent))",
          foreground: "hsl(let(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(let(--destructive))",
          foreground: "hsl(let(--destructive-foreground))",
        },
        border: "hsl(let(--border))",
        input: "hsl(let(--input))",
        ring: "hsl(let(--ring))",
        chart: {
          "1": "hsl(let(--chart-1))",
          "2": "hsl(let(--chart-2))",
          "3": "hsl(let(--chart-3))",
          "4": "hsl(let(--chart-4))",
          "5": "hsl(let(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(let(--sidebar-background))",
          foreground: "hsl(let(--sidebar-foreground))",
          primary: "hsl(let(--sidebar-primary))",
          "primary-foreground": "hsl(let(--sidebar-primary-foreground))",
          accent: "hsl(let(--sidebar-accent))",
          "accent-foreground": "hsl(let(--sidebar-accent-foreground))",
          border: "hsl(let(--sidebar-border))",
          ring: "hsl(let(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "let(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "let(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "blob": "blob 7s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
