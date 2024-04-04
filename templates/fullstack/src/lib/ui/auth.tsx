import Link from 'next/link'
import {getServerAuthSession} from '~/server/auth'

export default async function Auth() {
	const session = await getServerAuthSession()

	return (
		<div className={'flex'}>
			<p className={'mr-2'}>{session && <span>{session.user?.name}</span>}</p>
			<Link href={session ? '/api/auth/signout' : '/api/auth/signin/github'}>
				{session ? 'Sign out' : 'Sign in'}
			</Link>
		</div>
	)
}
