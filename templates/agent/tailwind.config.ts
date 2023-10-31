import config from '@rubriclab/tailwind-config'
import {Config} from 'tailwindcss'

const tailwindConfig = {
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
