/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	transpilePackages: ['@rubriclab/ui', '@rubriclab/utils'],
	experimental: {
		serverActions: true
	}
}

export default nextConfig
