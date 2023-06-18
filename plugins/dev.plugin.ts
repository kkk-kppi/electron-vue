import { BrowserWindow } from 'electron'
import { ViteDevServer } from "vite";

// learn by https://juejin.cn/book/7152717638173966349/section/7152720221663395853
export let devPlugin = () => {
  return {
    name: "dev-plugin",

    /*
      注册了一个configureServer的钩子
      当Vite为我们启动http服务的时候，configureServer钩子会被执行

      ViteDevServer为一个http.server
    */
    configureServer(server: ViteDevServer) {
      require("esbuild").buildSync({
        // 设置主进程的入口文件
        entryPoints: ["./src/main/main.entry.ts"],
        bundle: true,
        // 设置编译平台为node
        platform: "node",
        // 配置编译完成后的输出文件
        outfile: "./dist/main.entry.js",
        // 排除模块
        external: ["electron"],
      });

      /*
        通过监听server.httpServer的listening事件来判断httpServer是否已经成功启动
      */
      server.httpServer?.once("listening", () => {
        let { spawn } = require("child_process");
        let addressInfo = server.httpServer?.address() as any;
        console.log('addressInfo为：', addressInfo, addressInfo?.address !== '::', addressInfo?.address.includes('localhost'))

        // fix: 无法正确返回url的问题 addressInfo.address为'::', 这是为啥，node的原因吗？
        const localhost: string = (addressInfo?.address !== '::' || addressInfo?.address.includes('localhost')) ? addressInfo.address : 'localhost';
        let httpAddress = `http://${localhost}:${addressInfo?.port}`;

        /*
          通过Node.js的child_process模块的spawn方法启动electron子进程
        */
        let electronProcess = spawn(
          // 命令行参数
          require("electron").toString(),
          ["./dist/main.entry.js", httpAddress],
          // 配置对象
          {
            /*
              cwd属性用于设置当前的工作目录
              process.cwd()返回的值就是当前项目的根目录
              cwd()传入参数之后呢？
            */
            cwd: process.cwd(),
            /*
              stdio用于设置electron进程的控制台输出
              inherit 让子进程的控制台输出数据同步到主进程的控制台
              console.log的内容就可以在VSCode的控制台上看到了
            */
            stdio: "inherit",
          }
        );

        // 当electron子进程退出时，需要关闭Vite的http服务，并且控制父进程退出
        electronProcess.on("close", () => {
          server.close();
          process.exit();
        });
      });
    },
  };
};

// 先将开发config配置写在这里，后续再抽出去
export const WebPreferences = {
  nodeIntegration: true, // 把Node.js环境继承到渲染进程中
  webSecurity: false,
  allowRunningInsecureContent: true,
  contextIsolation: false, // 配置在同一个JavaScript上下文中使用Electron API
  webviewTag: true,
  spellcheck: false,
  disableHtmlFullscreenWindowResize: true
}

// 打开开发者调试工具
export const SetupDevTools = (app: BrowserWindow) => {
  app.webContents.openDevTools({
    mode: 'undocked'
  })
}

// 设置Vite模块别名与模块解析钩子
// 将一些常用的Node模块和Electron的内置模块提供给vite-plugin-optimizer
// 需要新增模块时, 增加
export const getReplacer = () => {
  let externalModels = [
    'os',
    'fs',
    'path',
    'events',
    'child_process',
    'crypto',
    'http',
    'buffer',
    'url',
    'better-sqlite3',
    'knex'
  ];

  let result: any = {};
  for (let item of externalModels) {
    result[item] = () => ({
      find: new RegExp(`^${item}$`),
      code: `
        const ${item} = require('${item}');
        export { ${item} as default }`
    });
  }


  result['electron'] = () => {
    let electronModules = [
      'clipboard',
      'ipcRenderer',
      'nativeImage',
      'shell',
      'webFrame'
    ].join(',');

    return {
      find: new RegExp(`^electron$`),
      code: `
        const {${electronModules}} = require('electron');
        export {${electronModules}}`,
    }
  }

  return result
}
/*
  测试getReplacer效果代码
  如下, vue文件中引入了node和electron的内置模块, 如果打印出对应的模块, 则getReplacer生效
  //src\App.vue
  import fs from "fs";
  import { ipcRenderer } from "electron";
  import { onMounted } from "vue";
  onMounted(() => {
    console.log(fs.writeFileSync);
    console.log(ipcRenderer);
  });
*/