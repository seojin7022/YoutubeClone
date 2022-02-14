const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css"
    })],
    entry: {
        main: "./src/client/js/main.js",
        videoPlayer: "./src/client/js/videoPlayer.js",
        upload: "./src/client/js/upload.js",
        video: "./src/client/js/video.js",
        uploadButton: "./src/client/js/uploadButton.js",
        recorder: "./src/client/js/recorder.js",
        detail: "./src/client/js/detail.js",
    },
    watch: true,
    mode: "development",
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, "assets"),
        clean: true,
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [["@babel/preset-env", {targets: "defaults"}]],
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            }
        ]
    }
}