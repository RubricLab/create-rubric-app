import BackgroundGrid from "../components/BackgroundGrid";

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
		<html lang='en'>
			{children}
			{/* <BackgroundGrid/> */}
		</html>
	)
}
