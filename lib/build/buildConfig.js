module.exports =  {
  mode: process.env.NODE_ENV,
  entry: getEntry(),
  output: {
    path: path.resolve(__dirname, '../dist/output'),
    filename: '[name]/[name].js',
    library: '[name]',
    libraryTarget: 'window',
    publicPath: upload.publicPath
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, '../src'),
      '@package': path.resolve(__dirname, '../packages'),
      '@root': path.resolve(__dirname, '..')
    },
    extensions: ['.vue', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              cssSourceMap: false,
              cacheBusting: false,
              esModule: true
            },
          }
        ],
        include:[
          path.resolve(__dirname, '../examples'),
          path.resolve(__dirname, '../packages')
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.styl(us)?$/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.(json|png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'images/[name]-[hash:6].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins:[
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({}),
    new VueSFCComponentPlugin({
      ...upload
    })
  ]
}