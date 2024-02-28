'use client'

import {ThemeProvider} from 'next-themes'
import {ReactNode} from 'react'
import {Toaster} from 'sonner'

export default function Providers({children}: {children: ReactNode}) {
	return (
		<ThemeProvider attribute={'class'}>
			<Toaster position='bottom-right' />
			{children}
		</ThemeProvider>
	)
}
