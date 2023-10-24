export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
		<html lang='en'>
			<body className={`relative flex h-full min-h-screen w-full flex-col items-center`}>
				<div className='z-10 w-full max-w-6xl p-5 pt-0'>{children}</div>
			</body>
		</html>
	)
}
