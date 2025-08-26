import { ImageResponse } from 'next/og'

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
				fontSize: 28,
				fontWeight: 700,
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
