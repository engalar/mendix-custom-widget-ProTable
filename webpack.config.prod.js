const merge = require("webpack-merge");

const baseConfig = require("./node_modules/@mendix/pluggable-widgets-tools/configs/webpack.config.prod.js");//Can also be webpack.config.prod.js


console.log(11111111111111111111111111111111);

const customConfig = {
    resolve: {
        externals: {
            'react/jsx-runtime': 'amd react/jsx-runtime',
            'react/jsx-dev-runtime': 'amd react/jsx-dev-runtime',
        },
    }
};

const previewConfig = {
    resolve: {
        externals: {
            'react/jsx-runtime': 'amd react/jsx-runtime',
            'react/jsx-dev-runtime': 'amd react/jsx-dev-runtime',
        },
    }
};

module.exports = [merge(baseConfig[0], customConfig), merge(baseConfig[1], previewConfig)];
