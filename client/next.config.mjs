/** @type {import('next').NextConfig} */
const nextConfig = {
	// 폰트 최적화 완전 비활성화 (OTS 파싱 에러 방지)
	optimizeFonts: false,

	// RSC Payload 에러 방지를 위한 설정
	experimental: {
		// RSC 스트리밍 비활성화 (에러 방지)
		rsc: {
			unstable_noStore: true,
		},
		// 프리페치 비활성화
		prefetch: false,
		// Fast Refresh 활성화 (HMR 유지)
		fastRefresh: true,
		// 개발 모드 완전 비활성화
		devIndicators: {
			buildActivity: false,
			buildActivityPosition: 'bottom-right',
		},
		optimizePackageImports: [],
		allowedDevOrigins: [
			'http://172.20.30.176:3000',
			'http://172.20.30.176:*',
			'http://localhost:3000',
			'http://localhost:*',
			'http://127.0.0.1:3000',
			'http://127.0.0.1:*',
		],
		// WebSocket HMR 설정 - 완전 비활성화 (오류 방지)
		webSocketUrl: undefined,
	},

	// designs 폴더 빌드 제외 설정 (프로젝트 루트로 이동됨)
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				net: false,
				tls: false,
				readline: false,
				electron: false,
				child_process: false,
				path: false,
				os: false,
				crypto: false,
				stream: false,
				util: false,
				url: false,
				querystring: false,
				http2: false,
				'chromium-bidi/lib/cjs/bidiMapper/BidiMapper': false,
				'chromium-bidi': false,
				'playwright-core': false,
				'@playwright/test': false,
			};
		}
		// designs 폴더의 모든 파일을 빌드에서 제외
		config.resolve.alias = {
			...config.resolve.alias,
			'@designs': false,
		}

		// designs 폴더의 모든 파일을 무시 (프로젝트 루트 기준)
		config.module.rules.push({
			test: /[\\/]designs[\\/].*\.(tsx|ts|jsx|js)$/,
			use: 'ignore-loader',
		})

		return config
	},

	// API 프록시 설정 및 designs 폴더 제외
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/:path*`,
			},
		]
	},

	// 🔒 보안 강화된 CORS 설정
	async headers() {
		return [
			{
				source: '/api/:path*',
				headers: [
					{
						key: 'Access-Control-Allow-Origin',
						value:
							process.env.NEXT_PUBLIC_ALLOWED_ORIGIN || 'http://localhost:3000',
					},
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET, POST, PUT, DELETE, OPTIONS',
					},
					{
						key: 'Access-Control-Allow-Headers',
						value: 'Content-Type, Authorization, X-Requested-With',
					},
					{
						key: 'Access-Control-Allow-Credentials',
						value: 'true',
					},
					// 🔒 보안 헤더 추가
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
				],
			},
		]
	},

	// 이미지 도메인 설정
	images: {
		domains: ['localhost'],
	},
}

export default nextConfig
