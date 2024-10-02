import config from '@rubriclab/config/tailwind'
import type { Config } from 'tailwindcss'

const tailwindConfig = {
	darkMode: 'class',
	content: ['./src/**/*.tsx'],
	presets: [config],
	theme: {
		colors: {
			...config.theme.colors
		},
		extend: {}
	}
} satisfies Config

export default tailwindConfig
