/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                'segoe': ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
            },
            colors: {
                'win-dark': {
                    50: '#2d2d2d',
                    100: '#252525',
                    200: '#202020',
                    300: '#1a1a1a',
                    400: '#141414',
                    500: '#0f0f0f',
                    600: '#0a0a0a',
                },
                'win-light': {
                    50: '#ffffff',
                    100: '#f9f9f9',
                    200: '#f3f3f3',
                    300: '#ebebeb',
                    400: '#e0e0e0',
                    500: '#d4d4d4',
                },
                'win-accent': {
                    DEFAULT: '#0078d4',
                    hover: '#1084d8',
                    pressed: '#006cbd',
                },
            },
            backdropBlur: {
                'win': '20px',
            },
            boxShadow: {
                'win': '0 8px 32px rgba(0, 0, 0, 0.3)',
                'win-light': '0 8px 32px rgba(0, 0, 0, 0.1)',
            },
        },
    },
    plugins: [],
}
