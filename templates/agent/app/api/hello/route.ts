import {NextRequest, NextResponse} from 'next/server'

export async function GET(request: NextRequest, {params}) {
	const {apiKey, message} = params

	if (apiKey !== '0') throw new Error('Unauthorized')

	return new NextResponse(`hello world! ${message}`)
}
