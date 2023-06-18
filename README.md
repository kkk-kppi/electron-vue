# Electron + Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## 项目工程结构
1. dist: 打包过程的临时产物放置mul
2. plugins 放置项目的开发环境Vite插件和打包Vite插件
3. release 放置最终生成的安装包
4. resource 放置一些外部资源，比如应用程序图标、第三方类库等
5. src/common 放置主进程和渲染进程都会用到的公共代码，比如日期格式化的工具类、数据库访问工具类等 
6. src/main 放置主进程的代码
7. src/model 放置应用程序的模型文件，比如消息类、会话类、用户设置类等，主进程和渲染进程的代码都有可能使用这些类
8. src/renderer 放置渲染进程的代码
9. src/renderer/assets 放置字体图标、公共样式、图片等文件
10. src/renderer/Component 放置公共组件，比如标题栏组件、菜单组件等
11. src/renderer/store 存放 Vue 项目的数据状态组件，用于在不同的 Vue 组件中共享数据
12. src/renderer/Window 存放不同窗口的入口组件，这些组件是通过 vue-router 导航的，这个目录下的子目录存放对应窗口的子组件
13. src/renderer/App.vue 是渲染进程的入口组件，这个组件内只有一个用于导航到不同的窗口
14. src/renderer/main.ts 是渲染进程的入口脚本
15. index.html 是渲染进程的入口页面
16. vite.config.ts 是 Vite 的配置文件