/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/components/UploadModal.jsx",
  ],
  theme: {
    fontFamily: {
      'billion': ['Billion', 'sans-serif'],
      'gentona-book': ['GentonaBook', 'sans-serif'],
      'pt-mono': ['PT Mono', 'monospace'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'slate-200': '#e2e8f0'
    },
    extend: {},
  },
  plugins:[
    require("daisyui"),
    require("@tailwindcss/typography")
  ],
  daisyui: {
    themes: [ 
      {
      uf: {
          "primary": "#FA4616",
          "secondary": "#d32737",
          "primary-focus": "#fa4616",
          "secondary-focus": "#d32737",
          "accent": "#0021a5",
          "neutral": "#002657",
          "base-100": "#ffffff",
          "info": "#335cff",
          "success": "#99adff",
	  "warning": "#f2A900",
	  "error": "#D32737",
	  "error-content": "#22884C",
        },
        ufdark: {
          "primary": "#FA4616",
          "secondary": "#d32737",
          "primary-focus": "#fa4616",
          "secondary-focus": "#d32737",
          "accent": "#0021a5",
          "neutral": "#002657",
          "base-100": "#000000",
	  "base-conte": "#FFFFFF",
          "info": "#335cff",
          "success": "#99adff",
	  "warning": "#f2A900",
	  "error": "#D32737",
        }
      }
    ]
  },
}

