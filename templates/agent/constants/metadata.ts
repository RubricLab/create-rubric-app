import {Metadata} from 'next'

export const META = {
	desc: 'Bootstrapped with create-rubric-app',
	siteURL: '',
	title: 'My Cool Agent',
	twitter: '@rubriclabs'
}

export const DEFAULT_META: Metadata = {
	description: META.desc,
	openGraph: {
		description: META.desc,
		title: META.title
	},
	title: META.title,
	twitter: {
		card: 'summary_large_image',
		creator: META.twitter,
		description: META.desc,
		title: META.title
	}
}
