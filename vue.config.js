module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/app-idcard/' : '/',
  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      importWorkboxFrom: 'local',
      globIgnores: [
        '**/config.json',
        '**/version.json',
        '**/px.gif'
      ],
      navigateFallback: 'index.html',
      cacheId: 'app-idcard',
      exclude: [ /\.config$/, /\.json$/, /\.version$/, /\.json$/, /\.json\.example$/, /px\.gif$/, /service-worker\.js$/, /\.map$/ ],
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [ {
        urlPattern: new RegExp('https:*'),
        handler: 'StaleWhileRevalidate'
      } ]
    }
  }
};
