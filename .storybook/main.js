const path = require('path')

module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss')
        }
      }
    }
  ],
  // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
  typescript: {
    check: true // type-check stories during Storybook build
  },
  framework: '@storybook/react',
  webpackFinal: async (config) => {
    config.resolve.alias['src'] = path.resolve(__dirname, '../src')
    config.resolve.alias['stories'] = path.resolve(__dirname, '../stories')

    config.module.rules.push({
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      include: path.resolve(__dirname, '../')
    })

    return config
  }
}
