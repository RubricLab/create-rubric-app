'use client'

import { signIn } from '~/auth/actions'

export function SignInWithGithubButton() {
	return (
		<button type="button" onClick={async () => signIn({ callbackUrl: '/', provider: 'github' })}>
			Sign In With Github
		</button>
	)
}
