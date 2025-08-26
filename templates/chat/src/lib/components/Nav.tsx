'use client'

import { useSession } from '~/auth/client'
import { SignOutButton } from '~/components/SignOut'

export function Nav() {
	const { user } = useSession()
	return (
		<div className="flex flex-row items-center justify-between gap-4 p-4">
			<a href="/">Home</a>
			<div className="flex flex-row items-center gap-4">
				<p>Signed in as {user.email}</p>
				<SignOutButton />
			</div>
		</div>
	)
}
