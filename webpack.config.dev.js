const merge = require("webpack-merge");

const baseConfig = require("@mendix/pluggable-widgets-tools/configs/webpack.config.dev.js");//Can also be webpack.config.prod.js

const customConfig = {
    //https://v4.webpack.js.org/configuration/externals/#externals
    externals: [
        'react/jsx-runtime',
        'react/jsx-dev-runtime'
    ]
};

const previewConfig = {
    externals: [
        'react/jsx-runtime',
        'react/jsx-dev-runtime'
    ]
};

module.exports = [merge(baseConfig[0], customConfig), merge(baseConfig[1], previewConfig)];
