const { join } = require('path')
const { override, addBabelPlugins, overrideDevServer } = require('customize-cra')

const additionalConfig = () => (config) => {
  require('react-app-rewire-postcss')(config, true)

  return config
}

module.exports = {
  webpack: override(
    ...addBabelPlugins(
      ...(process.env.NODE_ENV === 'production' ? [['transform-remove-console', { exclude: ['debug'] }]] : [])
    ),
    additionalConfig()
  ),
  devServer: overrideDevServer((devServerConfig) => {
    return {
      ...devServerConfig,
      contentBase: [devServerConfig.contentBase, join(__dirname, '/public')],
    }
  }),
}
