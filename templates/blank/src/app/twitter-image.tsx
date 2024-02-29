import OGImage, {ImageProps} from './opengraph-image'

export const runtime = 'edge'
export {alt, contentType, size} from './opengraph-image'

export default async function Response({params}: ImageProps) {
	return OGImage({params})
}
