//plugins\devPlugin.ts
import { ViteDevServer } from "vite";

export let devPlugin = () => {
  return {
    name: "dev-plugin",
    configureServer(server: ViteDevServer) {
      require("esbuild").buildSync({
        entryPoints: ["./src/main/main.entry.ts"],
        bundle: true,
        platform: "node",
        outfile: "./dist/main.entry.js",
        external: ["electron"],
      });

      server.httpServer.once("listening", () => {
        let { spawn } = require("child_process");
        let addressInfo = server.httpServer.address() as any;
        console.log('addressInfo为：', addressInfo, addressInfo?.address !== '::', addressInfo?.address.includes('localhost'))
        // fix: 无法正确返回url的问题 addressInfo.address为'::', 这是为啥，node的原因吗？
        const localhost: string = (addressInfo?.address !== '::' || addressInfo?.address.includes('localhost')) ? addressInfo.address : 'localhost';
        let httpAddress = `http://${localhost}:${addressInfo?.port}`;
        let electronProcess = spawn(
          require("electron").toString(),
          ["./dist/main.entry.js", httpAddress],
          {
            cwd: process.cwd(),
            stdio: "inherit",
          }
        );
        electronProcess.on("close", () => {
          server.close();
          process.exit();
        });
      });
    },
  };
};
