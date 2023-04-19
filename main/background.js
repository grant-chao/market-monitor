import {app, nativeImage} from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
      height: 42,
      width: 180,
      useContentSize: true,
      frame: false,   //要创建无边框窗口
      // resizable: false, //禁止窗口大小缩放
      transparent: true,  //设置透明
      alwaysOnTop: true,  //窗口是否总是显示在其他窗口之前
      icon: nativeImage.createFromPath('resources/icon.ico'), // "string" || nativeImage.createFromPath('src/image/icons/256x256.ico')从位于 path 的文件创建新的 NativeImage 实例
      webPreferences: { // 网页功能设置
          devTools: true, //关闭调试工具
          nodeIntegration: true, // 是否启用node集成 渲染进程的内容有访问node的能力
          webviewTag: true, // 是否使用<webview>标签 在一个独立的 frame 和进程里显示外部 web 内容
          webSecurity: false, // 禁用同源策略
          contextIsolation: false,
          nodeIntegrationInSubFrames: true // 是否允许在子页面(iframe)或子窗口(child window)中集成Node.js
      }
  });

  if (isProd) {
    await mainWindow.loadURL('app://./index.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    // mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
