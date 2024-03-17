/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { 
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        'rubik': ['Rubik', 'sans-serif'],
        'times-new-roman': ['Times New Roman', 'serif'],
        'helvetica': ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

