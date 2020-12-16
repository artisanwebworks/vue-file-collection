const path = require('path');
const VueLoaderPlugin = require('vue-loader/dist/plugin').default

module.exports = {

    entry: './test/app.js',
    mode: "development",
    devtool: "source-map",

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },

    module: {
        rules: [

            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        }
                    },

                ]
            },

            {
                test: /\.scss$/i,
                use: [

                    // Creates `style` nodes from JS strings
                    "style-loader",

                    // Translates CSS into CommonJS
                    "css-loader",

                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },

            {
                test: /\.css$/i,
                use: [

                    // Creates `style` nodes from JS strings
                    "style-loader",

                    // Translates CSS into CommonJS
                    "css-loader"
                ],
            },

            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },

            {
                test: /\.(png|jp[e]?g|svg|gif)/i,
                type: 'asset/resource'
            }
        ]
    },

    plugins: [
        // make sure to include the plugin!
        new VueLoaderPlugin()
    ]
};
