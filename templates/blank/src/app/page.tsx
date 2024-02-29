'use server'

import Link from 'next/link'
import {getDir} from '~/lib/utils'
import DemoForm from '~/ui/home/demo-form'

export default async function Page() {
	const dir = getDir()

	return (
		<div className='flex h-screen w-full flex-col justify-center gap-10 p-5 sm:p-20'>
			<h1>Welcome</h1>
			<p>
				To get started, edit{' '}
				<Link
					href={`vscode://file${dir}/src/app/page.tsx`}
					target='_blank'>
					<code>src/app/page.tsx</code>
				</Link>{' '}
				and save to reload.
			</p>
			<DemoForm />
		</div>
	)
}
