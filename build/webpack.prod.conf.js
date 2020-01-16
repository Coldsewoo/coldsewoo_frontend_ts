'use strict'

const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const SitemapPlugin = require('sitemap-webpack-plugin').default

const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

const env = require('../config/prod.env')

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true,
    }),
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
  },
  optimization: {
    splitChunks: {
      minSize: 10000,
      maxSize: 250000,
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env,
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
        },
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true,
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[hash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap ? { safe: true, map: { inline: false } } : { safe: true },
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*'],
      },
      {
        from: path.resolve(__dirname, '../_redirects'),
        to: config.build.assetsRoot,
      },
      {
        from: path.resolve(__dirname, '../favicon.ico'),
        to: config.build.assetsRoot,
      },
      {
        from: path.resolve(__dirname, '../site.webmanifest'),
        to: config.build.assetsRoot,
      },
      {
        from: path.resolve(__dirname, '../robots.txt'),
        to: config.build.assetsRoot,
      },
    ]),
    new BundleAnalyzerPlugin({ analyzerPort: 4200, analyzerMode: 'static', openAnalyzer: false, generateStatsFile: true, statsFilename: 'stats.json' }),
  ],
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(`\\.(${config.build.productionGzipExtensions.join('|')})$`),
      threshold: 10240,
      minRatio: 0.8,
    }),
  )
}

module.exports = () => {
  return new Promise((resolve, reject) => {
    utils.blogRoutes().then((blogRoutes) => {
      const paths = blogRoutes.map(e => e.path)
      webpackConfig.plugins.push(
        new PrerenderSPAPlugin({
          // Required - The path to the webpack-outputted app to prerender.
          staticDir: path.join(__dirname, '../web'),
          // Required - Routes to render.
          routes: ['/', '/blog', '/vuestagram', '/currency', '/qrcode', ...paths],
          postProcess(context) {
            const titles = Object.assign(
              {
                '/': 'Coldsewoo',
                '/blog': 'Coldsewoo - a blog',
                '/blog/home': 'Coldsewoo - a blog',
                '/vuestagram': 'Coldsewoo - Vuestagram',
                '/currency': 'Coldsewoo - Currency',
                '/qrcode': 'Coldsewoo - QRcode',
              },
              ...blogRoutes.map((e) => {
                const titleObj = {}
                Object.defineProperty(titleObj, `${e.route}`, { value: e.title, enumerable: true })
                return titleObj
              }),
            )
            const authors = Object.assign(
              ...blogRoutes.map((e) => {
                const authorObj = {}
                Object.defineProperty(authorObj, `${e.route}`, { value: e.author, enumerable: true })
                return authorObj
              }),
            )
            const desc = Object.assign(
              {
                '/': 'Home page',
                '/blog': 'Coldsewoo - a blog',
                '/blog/home': 'Coldsewoo - a blog',
                '/vuestagram': 'Instagram clone',
                '/currency': 'Currency exchange information',
                '/qrcode': 'QRcode Generator',
              },
              ...blogRoutes.map((e) => {
                const titleObj = {}
                Object.defineProperty(titleObj, `${e.route}`, { value: e.title, enumerable: true })
                return titleObj
              }),
            )
            context.path = context.originalPath
            context.html = context.html.replace(
              /<title>[^<]*<\/title>/i,
              `<meta name="description" content="${desc[context.route]}"><meta property="og:title" content="${
                titles[context.route]
              }"><meta property="og:type" content="website"><meta property="og:url" content="https://coldsewoo.com"><meta property="og:site_name" content="${
                titles[context.route]
              }"><meta property="og:description" content="${
                desc[context.route]
              }"><meta property="fb:admins" content="coldsewoo"><meta name="twitter:card" content="app"><meta name="twitter:site" content="@corysmc"><meta name="twitter:title" content="${
                titles[context.route]
              }"><meta name="twitter:description" content="${desc[context.route]}"><title>${
                titles[context.route]
              }</title>`,
            )
            console.log(titles[context.route])
            console.log(context.route)
            return context
          },
        }),
      )
      webpackConfig.plugins.push(new SitemapPlugin('https://coldsewoo.com', ['/', '/blog', '/vuestagram', '/currency', '/qrcode', ...paths], {
        skipGzip: true,
      }))
    })
    setTimeout(() => {
      resolve(webpackConfig)
    }, 5000)
  })
}
