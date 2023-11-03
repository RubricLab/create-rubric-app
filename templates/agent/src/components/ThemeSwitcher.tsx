'use client'

import {Moon, Sun} from 'lucide-react'
import {useTheme} from 'next-themes'

export function ThemeSwitcher() {
	const {theme, setTheme} = useTheme()

	return (
		<div>
			<button
				className='bg-primary'
				onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
				{theme === 'light' ? <Moon /> : <Sun />}
			</button>
		</div>
	)
}
