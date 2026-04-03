/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['tjzarxkwkyxhwgaooss.supabase.co'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; connect-src 'self' https://*.supabase.co https://api.anthropic.com; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*.supabase.co blob:;",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
