import Link from 'next/link'
import Tasks from '~/ui/tasks'
import getDir from '~/utils/getDir'

export default async function Page() {
	const dir = getDir()

	return (
		<div className='flex h-screen w-full flex-col justify-center gap-20 p-5 sm:p-20'>
			<Tasks />
			<p>
				To get started, edit{' '}
				<Link
					href={`vscode://file${dir}/src/app/page.tsx`}
					target='_blank'>
					<code>src/app/page.tsx</code>
				</Link>{' '}
				and save to reload.
			</p>
		</div>
	)
}
