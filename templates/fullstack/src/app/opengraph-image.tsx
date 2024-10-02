import { ImageResponse } from 'next/og'
import colors from 'tailwindcss/colors'
import BackgroundGrid from '~/ui/background-grid'

export const runtime = 'edge'
export const alt = 'Bootstrapped with create-rubric-app'
export const contentType = 'image/png'
export const size = {
	height: 630,
	width: 1200
}

export type ImageProps = {
	params: object
}

export const Component = () => {
	return (
		<div
			style={{
				alignItems: 'center',
				background: colors.black,
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				justifyContent: 'center',
				overflowY: 'hidden',
				position: 'relative',
				width: '100%'
			}}
		>
			<BackgroundGrid
				style={{
					position: 'absolute',
					width: size.width
				}}
			/>
			<div style={{ color: colors.white, fontSize: 128 }}>My App</div>
			<div style={{ color: colors.white, fontSize: 48 }}>Bootstrapped with create-rubric-app</div>
		</div>
	)
}

export default async function Response({ params }: ImageProps) {
	const localFont = await fetch(
		new URL('/public/fonts/PlusJakartaSans-Bold.ttf', import.meta.url)
	).then(res => res.arrayBuffer())

	return new ImageResponse(<Component />, {
		...size,
		fonts: [
			{
				name: 'Local Font',
				data: localFont,
				style: 'normal',
				weight: 700
			}
		]
	})
}
