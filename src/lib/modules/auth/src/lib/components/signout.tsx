'use client'
import { Button } from 'rubricui'
import { handleSignOut } from '~/(auth)/auth/signin/actions'

export function SignOut() {
	return <Button onClick={() => handleSignOut({ redirectUrl: '/auth/signin' })}>Sign Out</Button>
}
