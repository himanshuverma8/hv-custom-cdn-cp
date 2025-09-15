import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      animation: {
        'lightning-bolt': 'lightningBolt 2s ease-in-out infinite',
        'glow': 'glow 1.5s ease-in-out infinite alternate',
        'sparkle': 'sparkle 1s ease-in-out infinite',
      },
      keyframes: {
        lightningBolt: {
          '0%, 100%': {
            transform: 'scale(1) rotate(0deg)',
            opacity: '1',
          },
          '25%': {
            transform: 'scale(1.05) rotate(1deg)',
            opacity: '0.9',
          },
          '50%': {
            transform: 'scale(1.1) rotate(0deg)',
            opacity: '1',
          },
          '75%': {
            transform: 'scale(1.05) rotate(-1deg)',
            opacity: '0.9',
          },
        },
        glow: {
          '0%': {
            filter: 'drop-shadow(0 0 5px #ff6b6b) drop-shadow(0 0 10px #ff8e8e)',
          },
          '100%': {
            filter: 'drop-shadow(0 0 10px #ff4757) drop-shadow(0 0 20px #ff6b6b)',
          },
        },
        sparkle: {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '0.3',
          },
          '50%': {
            transform: 'scale(1.5)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
