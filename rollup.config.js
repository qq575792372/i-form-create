// 使用插件
// rollup的插件
import commonjs from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";
import postcss from "rollup-plugin-postcss";
import { nodeResolve } from "@rollup/plugin-node-resolve";
// vue的插件
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import autoprefixer from "autoprefixer";
// 引入package.json
import pkg from "./package.json";
// 引入打包工具类
import { pathResolve } from "./build/utils/util.js";
// 引入打包路径
import { inputSrc, outputEsm, root, outputLib, outputRoot, outputCjs, outputSrc } from "./build/utils/paths.js";

// 声明注释
const banner = `/*
 * ${pkg.name} v${pkg.version}
 * Copyright 2025-${new Date().getFullYear()}, ${pkg.author}
 * Released under the ${pkg.license} License.
 */`;

/**
 * rollup 配置
 */
export default {
  // 入口
  input: pathResolve(inputSrc, "./index.js"),
  // 输出
  output: [
    // 按需打包
    {
      format: "es",
      entryFileNames: "[name].mjs",
      preserveModules: true,
      preserveModulesRoot: pathResolve(outputRoot, "src"),
      dir: pathResolve(outputEsm),
      exports: undefined,
    },
    {
      format: "cjs",
      entryFileNames: "[name].cjs",
      preserveModules: true,
      preserveModulesRoot: pathResolve(outputRoot, "src"),
      dir: pathResolve(outputCjs),
      exports: "named",
    },
    // 打全量包
    {
      format: "es",
      entryFileNames: "[name].full.mjs",
      dir: outputLib,
      exports: undefined,
      globals: {
        vue: "Vue",
      },
      banner,
    },
    {
      format: "umd",
      name: `FormCreate`,
      entryFileNames: "[name].full.js",
      dir: outputLib,
      exports: "named",
      globals: {
        vue: "Vue",
      },
      banner,
    },
  ],
  // 排除模块
  external: ["vue"],
  // 使用插件
  plugins: [
    vue(),
    postcss({
      extract: true,
      minimize: true,
      plugins: [autoprefixer()],
    }),
    vueJsx(),
    nodeResolve(),
    commonjs(),
    // 处理文件中的别名为相对路径
    alias({
      entries: [
        {
          find: "~",
          replacement: pathResolve(root, "./"),
        },
        {
          find: "@",
          replacement: pathResolve(outputSrc, "./"),
        },
      ],
    }),
  ],
};
