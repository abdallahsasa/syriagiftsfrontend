/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#C6284A",
                "primary-dark": "#A81F3C",
                accent: "#E6C78B",
                cream: "#F8F3EC",
                "text-main": "#2A2A2A",
                "text-muted": "#6B6B6B",
                "success-elegant": "#2F5D50",
            },
        },
    },
    plugins: [],
}
