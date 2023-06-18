/* 
   主进程生产环境加载本地文件
   在进行build之后，需要使应用程序正常启动，开发时是通过process.argv[2]指定url的
   但生成环境的安装包是没有这个参数的

   这里要做的事情就是，让应用程序在没有这个参数时，也能加载我们的静态页面
*/


import { protocol } from 'electron'
import path from 'path'
import fs from 'fs'

// 为自定义的app协议提供特权
let schemeConfig = {
   standard: true,
   supportFetchAPI: true,
   bypassCSP: true,
   corsEnabled: true,
   stream: true
};

/* 
   在主进程app ready前，通过 protocol 对象的 registerSchemesAsPrivileged 方法
   为名为 app 的 scheme 注册了特权（可以使用 FetchAPI、绕过内容安全策略等）。
*/
protocol.registerSchemesAsPrivileged(
   [
      {
         scheme: 'app',
         privileges: schemeConfig
      }
   ]
)

export class ElectronScheme {
   /*
      给出响应时，要指定响应的 statusCode 和 content-type，这个 content-type 是通过文件
      的扩展名得到的。这里我们通过 getMimeType 方法确定了少量文件的 content-type，如果的
      应用要支持更多文件类型，那么可以扩展这个方法。
   */
   // 根据扩展名获取mime-type
   private static getMimeType(extension: string) {
      let mimeType = '';
      if (extension === ".js") {
         mimeType = "text/javascript";
       } else if (extension === ".html") {
         mimeType = "text/html";
       } else if (extension === ".css") {
         mimeType = "text/css";
       } else if (extension === ".svg") {
         mimeType = "image/svg+xml";
       } else if (extension === ".json") {
         mimeType = "application/json";
       }
       return mimeType;
   }

   // 注册自定义app协议
   static registerScheme() {
      /*
         在app ready之后，通过 protocol 对象的 registerStreamProtocol 方法
         为名为 app 的 scheme 注册了一个回调函数。当我们加载类似app://index.html这样的路径
         时，这个回调函数将被执行。

         通过request.url获取到请求的文件路径，通过callbacl做出响应
      */
      protocol.registerStreamProtocol('app', (request, callback) => {
         let pathName = new URL(request.url).pathname;
         let extension = path.extname(pathName).toLowerCase();

         if(extension === '') {
            pathName = "index.html";
            extension = '.html'
         }

         let tarFile = path.join(__dirname, pathName);

         /*
            响应的 data 属性为目标文件的可读数据流。
            这也是为什么我们用 registerStreamProtocol 方法注册自定义协议的原因。
            当你的静态文件比较大时，不必读出整个文件再给出响应。
         */
         callback({
            statusCode: 200,
            headers: {
               "content-type": this.getMimeType(extension),
            },
            data: fs.createReadStream(tarFile)
         })
      })
   }
}

// 最后，前往main.entry.ts修改代码，兼容没有process.argv[2]的情况