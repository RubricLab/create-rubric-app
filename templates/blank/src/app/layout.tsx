import {Plus_Jakarta_Sans} from 'next/font/google'
import {Metadata} from 'next/types'
import Providers from '~/app/providers'
import {DEFAULT_META} from '~/lib/constants/metadata'
import BackgroundGrid from '~/ui/layout/background-grid'
import Nav from '~/ui/layout/nav'
import './styles.css'

const font = Plus_Jakarta_Sans({subsets: ['latin']})

export const metadata: Metadata = {
	alternates: {
		canonical: '/',
		languages: {
			'en-US': '/en-US'
		}
	},
	metadataBase: new URL(
		process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: `http://localhost:${process.env.PORT || 3000}`
	),
	...DEFAULT_META
}

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
		<html lang='en'>
			<body
				className={`${font.className} relative flex h-full min-h-screen w-full flex-col items-center`}>
				<Providers>
					<BackgroundGrid className='fixed h-full w-full opacity-30 dark:opacity-40' />
					<Nav title={'> npx create-rubric-app'} />
					<div className='z-10 flex w-full max-w-3xl items-center justify-center'>
						{children}
					</div>
				</Providers>
			</body>
		</html>
	)
}
