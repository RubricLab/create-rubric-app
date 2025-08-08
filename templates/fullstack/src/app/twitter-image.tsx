import OGImage from './opengraph-image'

export const runtime = 'edge'
export { alt, contentType, size } from './opengraph-image'

export default async function Response() {
	return OGImage()
}
