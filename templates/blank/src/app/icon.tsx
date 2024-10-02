import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const contentType = 'image/png'
export const size = {
	height: 32,
	width: 32
}

export default async function Icon() {
	return new ImageResponse(
		<div
			style={{
				alignItems: 'center',
				background: 'black',
				color: 'white',
				display: 'flex',
				fontWeight: 700,
				fontSize: 28,
				height: '100%',
				justifyContent: 'center',
				width: '100%'
			}}
		>
			R
		</div>,
		{
			...size
		}
	)
}
