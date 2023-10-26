import config from '@rubriclab/tailwind-config'
import {Config} from 'tailwindcss'

const tailwindConfig = {
	content: ['./app/**/*.tsx', './components/**/*.tsx'],
	presets: [config],
	theme: {
		colors: {
			...config.theme.colors
		},
		extend: {}
	}
} satisfies Config

export default tailwindConfig
