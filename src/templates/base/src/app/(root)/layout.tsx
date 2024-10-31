import type { ReactNode } from 'react'
import '../styles.css'
import { ClientAuthProvider } from '@rubriclab/auth'
import { getSession } from '~/auth/actions'

export default async function RootLayout({
	children
}: {
	children: ReactNode
}) {
	const session = await getSession()

	return (
		<html className="dark:dark flex h-full w-full items-center justify-center" lang="en">
			<body className="h-full w-full">
				<ClientAuthProvider session={session}>{children}</ClientAuthProvider>
			</body>
		</html>
	)
}
