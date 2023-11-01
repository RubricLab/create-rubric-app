import Link from 'next/link'

export default function Nav({title}: {title: string}) {
	return (
		<div className='fixed top-0 z-20 w-full p-5'>
			<Link
				href='/'
				className='font-bold'>
				{title}
			</Link>
		</div>
	)
}
