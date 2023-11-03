'use client'

import {Moon, Sun} from 'lucide-react'
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
				{theme === 'light' ? <Moon /> : <Sun />}
			</button>
		</div>
	)
}
