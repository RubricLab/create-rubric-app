import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className={'relative flex h-full min-h-screen w-full flex-col items-center'}>
				<div className="z-10 flex w-full max-w-3xl items-center justify-center">{children}</div>
			</body>
		</html>
	)
}
