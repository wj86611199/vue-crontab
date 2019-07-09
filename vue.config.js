const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");

// 拼接路径
const resolve = dir => require("path").join(__dirname, dir);

// 增加环境变量
let publicPath = "./";

 const Timestamp = new Date().getTime();
 module.exports = {
  publicPath, // 根据你的实际情况更改这里
  lintOnSave: true,
  devServer: {
    port: 8081,
    disableHostCheck: true,
  },
  configureWebpack: {
    // webpack 配置
    output: {
      // 输出重构  打包编译后的 文件名称  【模块名称.时间戳】
      filename: `[name].${Timestamp}.js`,
      chunkFilename: `[name].${Timestamp}.js`
    }
  },
  // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
  chainWebpack: config => {
    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
     * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
     */
    config.plugins.delete("prefetch").delete("preload");
    // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
    config.resolve.symlinks(true);
    config
      // 开发环境
      .when(
        process.env.NODE_ENV === "development",
        // sourcemap不包含列信息
        config => config.devtool("cheap-source-map")
      )
      // 非开发环境
    // i18n
    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .use("i18n")
      .loader("@kazupon/vue-i18n-loader")
      .end();
    config.module.rules.delete("svg");

    config.module
      .rule("svg")
      .test(/\.(svg)(\?.*)?$/)
      .include.add(path.resolve(__dirname, "src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader");

    // image exclude
    const imagesRule = config.module.rule("images");
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude.add(resolve("src/assets/svg-icons/icons"))
      .end();
    // 重新设置 alias
    config.resolve.alias
      .set("vue$", "vue/dist/vue.esm.js")
      .set("api", resolve("src/api"))
      .set("styles", resolve("src/styles"))
      .set("views", resolve("src/views"))
      .set("routes", resolve("src/router"))
      .set("components", resolve("src/components"));
  }
};
