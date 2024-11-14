import { handleSignOut } from '~/(auth)/auth/signin/actions'

export async function GET() {
	await handleSignOut({ redirectUrl: '/auth/signin' })
}
