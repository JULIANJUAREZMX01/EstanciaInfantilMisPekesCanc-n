/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				pekes: {
					primary:  '#00b8a0',
					light:    '#00d4b8',
					dark:     '#1a4d47',
					coral:    '#ff8c42',
					blue:     '#457b9d',
					green:    '#7bc043',
					pink:     '#ff6ec7',
					cream:    '#f8faf9',
				},
			},
			fontFamily: {
				sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
