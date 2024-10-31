'use client'
import { SignOut } from '~/components/signout'

export default async () => {
	return (
		<>
			<div className="flex w-full justify-between px-8 py-4">
				<a href="/">X</a>
				<SignOut />
			</div>
			<div>Welcome</div>
		</>
	)
}
