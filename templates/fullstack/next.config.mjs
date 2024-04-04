/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			`${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`
		]
	}
}

export default nextConfig
