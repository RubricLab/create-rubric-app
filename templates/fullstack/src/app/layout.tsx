import { Plus_Jakarta_Sans } from 'next/font/google'
import { headers } from 'next/headers'
import type { Metadata } from 'next/types'
import type { ReactNode } from 'react'
import { DEFAULT_META } from '~/constants/metadata'
import { FilesProvider } from '~/context/fileContext'
import { TaskProvider } from '~/context/taskContext'
import BackgroundGrid from '~/ui/background-grid'
import Nav from '~/ui/nav'
import ComposeProviders from '~/utils/composeProviders'
import { TRPCReactProvider } from '~/utils/trpc/react'
import { api } from '~/utils/trpc/server'
import type { RouterOutputs } from '~/utils/trpc/shared'
import './styles.css'

const font = Plus_Jakarta_Sans({ subsets: ['latin'] })

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

export default async function RootLayout({ children }: { children: ReactNode }) {
	let tasks: RouterOutputs['task']['getAll'] = []
	try {
		tasks = await api.task.getAll.query()
	} catch (e) {
		// user is not authenticated
	}

	return (
		<html lang="en">
			<body
				className={`${font.className} relative flex h-full min-h-screen w-full flex-col items-center`}
			>
				<BackgroundGrid className="-z-10 fixed h-full w-full opacity-30 dark:opacity-40" />
				<ComposeProviders
					providers={[
						{ provider: TRPCReactProvider, props: { headers: headers() } },
						{ provider: TaskProvider, props: { tasks } },
						{ provider: FilesProvider }
					]}
				>
					<Nav title={'> npx create-rubric-app'} />
					{children}
				</ComposeProviders>
			</body>
		</html>
	)
}
