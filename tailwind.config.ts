import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./constants/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			fill: {
  				'1': 'rgba(255, 255, 255, 0.10)'
  			},
  			bankGradient: '#0179FE',
  			indigo: {
  				'500': '#6172F3',
  				'700': '#3538CD'
  			},
			current: "currentColor",
			  transparent: "transparent",
			  white: "#FFFFFF",
			  black: "#121723",
			  dark: "#1D2430",
			  primary: "#4A6CF7",
			 
			  "bg-color-dark": "#171C28",
			  "body-color": {
				DEFAULT: "#788293",
				dark: "#959CB1",
			  },
			  stroke: {
				stroke: "#E3E8EF",
				dark: "#353943",
			  },
  			success: {
  				'25': '#F6FEF9',
  				'50': '#ECFDF3',
  				'100': '#D1FADF',
  				'600': '#039855',
  				'700': '#027A48',
  				'900': '#054F31'
  			},
  			pink: {
  				'25': '#FEF6FB',
  				'100': '#FCE7F6',
  				'500': '#EE46BC',
  				'600': '#DD2590',
  				'700': '#C11574',
  				'900': '#851651'
  			},
  			blue: {
  				'25': '#F5FAFF',
  				'100': '#D1E9FF',
  				'500': '#2E90FA',
  				'600': '#1570EF',
  				'700': '#175CD3',
  				'900': '#194185'
  			},
  			sky: {
  				'1': '#F3F9FF'
  			},
  			
  			gray: {
  				'25': '#FCFCFD',
  				'200': '#EAECF0',
  				'300': '#D0D5DD',
  				'500': '#667085',
  				'600': '#475467',
  				'700': '#344054',
  				'900': '#101828'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		backgroundImage: {
  			'bank-gradient': 'linear-gradient(90deg, #0179FE 0%, #4893FF 100%)',
  			'gradient-mesh': 'url("/icons/gradient-mesh.svg")',
  			'bank-green-gradient': 'linear-gradient(90deg, #01797A 0%, #489399 100%)'
  		},
  		boxShadow: {
			signUp: "0px 5px 10px rgba(4, 10, 34, 0.2)",
			one: "0px 2px 3px rgba(7, 7, 77, 0.05)",
			two: "0px 5px 10px rgba(6, 8, 15, 0.1)",
			three: "0px 5px 15px rgba(6, 8, 15, 0.05)",
			sticky: "inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)",
			"sticky-dark": "inset 0 -1px 0 0 rgba(255, 255, 255, 0.1)",
			"feature-2": "0px 10px 40px rgba(48, 86, 211, 0.12)",
			submit: "0px 5px 20px rgba(4, 10, 34, 0.1)",
			"submit-dark": "0px 5px 20px rgba(4, 10, 34, 0.1)",
			btn: "0px 1px 2px rgba(4, 10, 34, 0.15)",
			"btn-hover": "0px 1px 2px rgba(0, 0, 0, 0.15)",
			"btn-light": "0px 1px 2px rgba(0, 0, 0, 0.1)",
		  },
  		fontFamily: {
  			inter: 'var(--font-inter)',
  			'ibm-plex-serif': 'var(--font-ibm-plex-serif)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
