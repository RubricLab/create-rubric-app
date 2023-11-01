import Link from 'next/link'

export default function Nav({title}: {title: string}) {
	return (
		<div className='fixed top-0 z-20 flex w-full flex-col p-5'>
			<Link
				className='text-xl font-bold no-underline'
				href='https://github.com/rubriclab/create-rubric-app'
				target='_blank'>
				{title}
			</Link>

			<Link
				href='https://rubriclabs.com/blog/cra'
				target='_blank'
				className='no-underline'>
				learn more
			</Link>
		</div>
	)
}
