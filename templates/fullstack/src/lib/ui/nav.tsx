import Link from 'next/link'
import Auth from './auth'
import Photo from './photo'

export default function Nav({title}: {title: string}) {
	return (
		<div className='fixed top-0 z-20 flex w-full items-center justify-between p-5'>
			<div className='flex flex-col'>
				<Link
					className='text-xl font-bold no-underline'
					href='https://github.com/rubriclab/create-rubric-app'
					target='_blank'>
					{title}
				</Link>

				<Link
					href='https://rubriclabs.com/blog/cra'
					target='_blank'
					className='text-secondary no-underline'>
					learn more
				</Link>
			</div>
			<div className='flex items-center gap-2'>
				<Photo />
				<Auth />
			</div>
		</div>
	)
}
