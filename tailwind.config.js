/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                minecraft: ['"Press Start 2P"', 'cursive'],
            },
            colors: {
                minecraft: {
                    green: '#5cb85c',
                    dirt: '#795548',
                    stone: '#9e9e9e',
                }
            }
        },
    },
    plugins: [],
}
