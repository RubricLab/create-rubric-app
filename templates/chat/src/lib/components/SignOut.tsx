'use client'

import { signOut } from '~/auth/actions'

export function SignOutButton() {
	return (
		<button
			type="button"
			className="underline underline-offset-4"
			onClick={async () => signOut({ redirect: '/signin' })}
		>
			Sign Out
		</button>
	)
}
