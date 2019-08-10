const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode:      'development',
    externals: [nodeExternals({
        modulesFromFile: true
    })],
    devtool:   'inline-source-map',
    devServer: {
        contentBase:      './dist',
        disableHostCheck: true
    },
    entry:     {
        app: './src/index.js'
    },
    output:    {
        filename: '[name].bundle.js',
        path:     path.resolve(__dirname, 'dist')
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/app/index.html'
        }),

    ],
    node: {
        fs: 'empty'
    },
    module: {
        rules:
            [
                {
                    test: /\.css$/,
                    use:  [
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use:  [
                        'file-loader'
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use:  [
                        'file-loader'
                    ]
                },
                {
                    test: /\.(.yml)$/,
                    use:  [
                        'js-yaml-loader'
                    ]
                },
                {
                    test: /\.(.json)$/,
                    use:  [
                        'json-loader'
                    ]
                },
                {
                    test: /\.html$/,
                    use:  [{
                        loader:  'html-loader',
                        options: {
                            minimize:           true,
                            removeComments:     false,
                            collapseWhitespace: false
                        }
                    }]
                }

            ]
    }
}
;