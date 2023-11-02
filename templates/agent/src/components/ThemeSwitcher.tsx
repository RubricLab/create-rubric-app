'use client'

import {useTheme} from 'next-themes'
import {useEffect, useState} from 'react'

export function ThemeSwitcher() {
	const {theme, setTheme} = useTheme()

	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	return (
		<div>
			<button
				className='bg-primary'
				onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
				{theme === 'light' ? (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						stroke-width='2'
						stroke-linecap='round'
						stroke-linejoin='round'
						className='lucide lucide-moon'>
						<path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
					</svg>
				) : (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						stroke-width='2'
						stroke-linecap='round'
						stroke-linejoin='round'
						className='lucide lucide-sun'>
						<circle
							cx='12'
							cy='12'
							r='4'
						/>
						<path d='M12 2v2' />
						<path d='M12 20v2' />
						<path d='m4.93 4.93 1.41 1.41' />
						<path d='m17.66 17.66 1.41 1.41' />
						<path d='M2 12h2' />
						<path d='M20 12h2' />
						<path d='m6.34 17.66-1.41 1.41' />
						<path d='m19.07 4.93-1.41 1.41' />
					</svg>
				)}
			</button>
		</div>
	)
}
