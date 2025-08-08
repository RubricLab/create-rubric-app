import config from '@rubriclab/config/tailwind'
import type { Config } from 'tailwindcss'

export default {
	content: ['./src/**/*.tsx'],
	darkMode: 'class',
	presets: [config],
	theme: {
		colors: {
			...config.theme.colors
		},
		extend: {}
	}
} satisfies Config
