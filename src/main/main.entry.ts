import { app, BrowserWindow } from 'electron'
import { WebPreferences, SetupDevTools } from '../../plugins/dev.plugin'
import { ElectronScheme } from './custom.scheme';

// 设置渲染进程开发者调试工具的告警，isdisabled true则不显示任何告警，false则显示
/*
   如果渲染进程的代码可以访问 Node.js 的内置模块，而且渲染进程加载的页面（或脚本）是第三方开发的，
   那么恶意第三方就有可能使用 Node.js 的内置模块伤害最终用户 。这就是为什么这里要有这些警告的原因。
   如果你的应用不会加载任何第三方的页面或脚本。那么就不用担心这些安全问题啦。
*/
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true"

// Global Variable
let mainWindow: BrowserWindow;

app.whenReady().then(() => {
   mainWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      // config item by url - https://www.electronjs.org/zh/docs/latest/api/browser-window#new-browserwindowoptions
      webPreferences: WebPreferences
   });

   // TODO: 如果出现白屏问题，则可能为loadURL的address不对
   // mainWindow.loadURL(process.argv[2])

   /*
      这样当存在指定的命令行参数时，我们就认为是开发环境，使用命令行参数加载页面
      当不存在命令行参数时，我们就认为是生产环境，通过app:// scheme 加载页面。
   */
   if (process.argv[2]) {
      // 打开开发者调试工具
      SetupDevTools(mainWindow)
      // load vite http url
      mainWindow.loadURL(process.argv[2])
   } else {
      ElectronScheme.registerScheme();
      mainWindow.loadURL(`app://index.html`)
   }
})