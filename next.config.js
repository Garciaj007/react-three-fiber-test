/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(glsl|vert|frag|comp|geom|tesc|tese)$/,
      exclude: /node_modules/,
      use: [
        'raw-loader',
        'glslify-loader',
      ]
    })
    return config
  }
}

module.exports = nextConfig
