import { app, BrowserWindow } from 'electron'

// Global Variable
let mainWindow: BrowserWindow;

app.whenReady().then(() => {
   mainWindow = new BrowserWindow({
      width: 1024,
      height: 768
   });
   // TODO: 如果出现白屏问题，则可能为loadURL的address不对
   mainWindow.loadURL(process.argv[2])
})