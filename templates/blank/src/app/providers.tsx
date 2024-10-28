'use client'

import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'

const ThemeProvider = dynamic(() => import('next-themes').then(e => e.ThemeProvider), {
	ssr: false
}) // https://github.com/shadcn-ui/ui/issues/5552#issuecomment-2435053678

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider attribute={'class'}>
			<Toaster position="bottom-right" />
			{children}
		</ThemeProvider>
	)
}
