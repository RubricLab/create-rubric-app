import { getSession } from '~/auth/actions'
import { ClientAuthProvider } from '~/auth/client'
import { Nav } from '~/components/Nav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		// @ts-expect-error: Auth Package Bug
		<ClientAuthProvider session={await getSession({ redirectUnauthorized: '/signin' })}>
			<div className="flex min-h-screen flex-col">
				<Nav />
				<div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center p-10">
					<div className="flex w-full flex-col items-center">{children}</div>
				</div>
			</div>
		</ClientAuthProvider>
	)
}
