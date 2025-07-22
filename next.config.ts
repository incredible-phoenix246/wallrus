import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    browserDebugInfoInTerminal: true,
    devtoolSegmentExplorer: true,
  },
}

export default nextConfig
