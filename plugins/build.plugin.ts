import path from "path";
import fs from "fs";

// learn by https://juejin.cn/book/7152717638173966349/section/7152717638244761637
class ElectronBuild {
   // 编译主进程代码
   buildMain() {
      require("esbuild").buildSync({
         entryPoints: ["./src/main/main.entry.ts"],
         bundle: true,
         platform: "node",
         minify: true, // 生成压缩后的代码
         outfile: "./dist/main.entry.js",
         external: ["electron"],
      });
   }

   // 为生产环境准备package.json
   preparePackageJson() {
      let pkgJsonPath = path.join(process.cwd(), "package.json");
      let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
      let electronConfig = localPkgJson.devDependencies.electron.replace("^", "");
      localPkgJson.main = "main.entry.js";
      delete localPkgJson.scripts;
      delete localPkgJson.devDependencies;
      localPkgJson.devDependencies = { electron: electronConfig };
      let tarJsonPath = path.join(process.cwd(), "dist", "package.json");
      fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
      fs.mkdirSync(path.join(process.cwd(), "dist/node_modules"));
   }

   // 使用electron-builder制作安装包
   BuildInstaller = () => {
      let options = {
         config: {
            directories: {
               output: path.join(process.cwd(), "release"),
               app: path.join(process.cwd(), "dist"),
            },
            files: ["**"],
            extends: null,
            productName: "B-App",
            appId: "banban.app.desktop",
            asar: true,
            nsis: {
               oneClick: true,
               perMachine: true,
               allowToChangeInstallationDirectory: false,
               createDesktopShortcut: true, // 创建桌面快捷方式
               createStartMenuShortcut: true, // 创建启动快捷菜单
               shortcutName: "BanbanDesktop", // 快捷方式名称
            },
            publish: [{ provider: "generic", url: "http://localhost:5500/" }],
         },
         project: process.cwd(),
      };
      // 使用electron-builder打包成安装包
      return require("electron-builder").build(options);
   }
}

export const BuildPlugin = () => {
   return {
      name: 'electron-build-plugin',
      closeBundle: () => { // Vite编译完之后执行
         let builder = new ElectronBuild()
         builder.buildMain();
         builder.preparePackageJson()
         builder.BuildInstaller()
      }
   }
}
