const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const WebpackBar = require('webpackbar')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { isDev, PROJECT_PATH, IS_OPEN_HARD_SOURCE } = require('../constants')

const getCssLoaders = (importLoaders) => [
  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      modules: false,
      sourceMap: isDev,
      importLoaders,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: [
        // 修复一些和 flex 布局相关的 bug
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            grid: true,
            flexbox: 'no-2009'
          },
          stage: 3,
        }),
        require('postcss-normalize'),
      ],
      sourceMap: isDev,
    },
  },
]

module.exports = {
  entry: {
    app: resolve(PROJECT_PATH, './src/index.tsx'),
  },
  output: {
    filename: `js/[name]${isDev ? '' : '.[hash:8]'}.js`,
    path: resolve(PROJECT_PATH, './dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(tsx?|js)$/,
            loader: 'babel-loader',
            options: { cacheDirectory: true },
            exclude: /node_modules/,
          },
          {
            test: /\.css$/,
            use: getCssLoaders(1),
          },
          {
            test: /\.less$/,
            use: [
              ...getCssLoaders(2),
              {
                loader: 'less-loader',
                options: {
                  sourceMap: isDev,
                },
              },
            ],
          },
          {
            test: /\.scss$/,
            use: [
              ...getCssLoaders(2),
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: isDev,
                },
              },
            ],
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 10 * 1024,
                  name: '[name].[contenthash:8].[ext]',
                  outputPath: 'assets/images',
                },
              },
            ],
          },
          {
            test: /\.(ttf|woff|woff2|eot|otf)$/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  name: '[name].[contenthash:8].[ext]',
                  outputPath: 'assets/fonts',
                },
              },
            ],
          },
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(PROJECT_PATH, './public/index.html'),
      filename: 'index.html',
      cache: false,
      minify: isDev ? false : {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true,
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        useShortDoctype: true,
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          context: resolve(PROJECT_PATH, './public'),
          from: '*',
          to: resolve(PROJECT_PATH, './dist'),
          toType: 'dir',
        },
      ],
    }),
    new WebpackBar({
      name: isDev ? '正在启动' : '正在打包',
      color: '#fa8c16',
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: resolve(PROJECT_PATH, './tsconfig.json'),
      },
    }),
    IS_OPEN_HARD_SOURCE && new HardSourceWebpackPlugin(),
    !isDev && new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
      ignoreOrder: false,
    }),
  ].filter(Boolean),
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  optimization: {
    minimize: !isDev,
    minimizer: [
      !isDev && new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: { pure_funcs: ['console.log'] },
        }
      }),
      !isDev && new OptimizeCssAssetsPlugin()
    ].filter(Boolean),
    splitChunks: {
      chunks: 'all',// 默认只分割异步模块
      minSize: 0,// 分割出去的代码块的最小体积，0表示不限制
      maxSize: 0,// 分割出去的代码块的最大体积，0表示不限制
      // minRemainingSize: 0,// 分割后剩下体积 0表示不限制 webpack5新添的参数
      // minChunks: 1,//如果此模块被多个入口引用几次会被分割
      maxAsyncRequests: 30,// 异步请求最大分割出去几个代码块
      maxInitialRequests: 30,// 同步时最大分割出去几个代码块
      automaticNameDelimiter: '~',// 名称的分隔符
      enforceSizeThreshold: 50000,// 强制阈值 新增加的参数
      cacheGroups: {// 缓存组配置 配置如何对模块分组相同分组会分到一个代码块中
        defaultVendors: {// 第三方模块
          test: /[/\\]node_modules[/\\]/,// 如果模块的路径匹配此正则的话
          priority: -10,// 很多缓存组，如果一个模块同属于多个缓存组，应该分到哪个组里，看优先级高
          reuseExistingChunk: true// 是否可复用现有的代码块 单独写个例子
        },
        default: {
          minChunks: 2,// 此模块最几个入口引用过,最少2个才取提取
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
}
