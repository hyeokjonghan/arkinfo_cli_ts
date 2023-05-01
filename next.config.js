/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    includePath: [path.join(__dirname), 'styles'],
    prependData: `@import "styles/_variables.scss"; @import "styles/_mixins.scss";`,
  },
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2idxxstv7hcw9.cloudfront.net',
        port: '',
        pathname: '/**',
      },
    ],
  }
}

module.exports = nextConfig
