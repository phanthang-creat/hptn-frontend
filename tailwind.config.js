/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: 'Poppins, sans-serif',
        inter: 'Inter, sans-serif',
        graphik: 'Graphik, sans-serif',
        dancingScript: 'DancingScript, sans-serif'
      },
      colors: {
        primary: '#222222',
        secondary: '#717171',
        highlight: '#FF385C',
        logo: '#FF385C'
      },
      boxShadow: {
        'pano-1': 'rgba(0, 0, 0, 0.2) 0px 2px 8px 0px'
      },
      height: {
        header: '64px'
      },
      keyframes: {
        slide: {
          from: { transform: 'translateX(0%)' },
          to: { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        'infinite-looper': 'slide linear infinite '
      }
    }
  },
  plugins: []
}
