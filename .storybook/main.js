const path = require('path')

module.exports = {
  stories: ['./**/*.stories.tsx'],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    })
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [['react-app']],
          },
        },
        require.resolve('ts-loader'),
      ],
    })
    config.resolve.extensions.push('.ts', '.tsx')
    return config
  },
}
